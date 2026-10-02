import uuid
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.models.interview import InterviewSessionModel, InterviewMessageModel

router = APIRouter(prefix="/interview", tags=["Mock Interview Drills"])


# ------------------------------------------------------------------------------
# Pydantic Schemas
# ------------------------------------------------------------------------------
class InterviewQuestion(BaseModel):
    id: str
    category: str
    difficulty: str
    targetTime: str
    question: str
    rubricTips: str
    keyConcepts: List[str]


class StartSessionRequest(BaseModel):
    candidateName: Optional[str] = "Candidate"
    targetRole: Optional[str] = "Full Stack Software Engineer"
    difficulty: Optional[str] = "Mid-Senior"


class StartSessionResponse(BaseModel):
    sessionId: str
    candidateName: str
    targetRole: str
    difficulty: str
    firstQuestion: InterviewQuestion
    greetingMessage: str


class AnswerSubmissionRequest(BaseModel):
    questionId: str
    answerText: str


class RubricEvaluation(BaseModel):
    score: int = Field(ge=0, le=100)
    strengths: List[str]
    missingConcepts: List[str]
    rubricTips: str
    feedback: str
    starMethodAssessment: Optional[str] = None


class AnswerSubmissionResponse(BaseModel):
    sessionId: str
    questionId: str
    evaluation: RubricEvaluation
    nextQuestion: Optional[InterviewQuestion] = None
    isCompleted: bool = False
    aiResponseAudioCue: Optional[str] = None


class MessageSchema(BaseModel):
    id: str
    role: str
    content: str
    score: Optional[float] = None
    feedback: Optional[Dict[str, Any]] = None
    timestamp: str


class SessionReportCard(BaseModel):
    sessionId: str
    candidateName: str
    targetRole: str
    difficulty: str
    overallScore: float
    totalQuestionsAnswered: int
    summary: str
    messages: List[MessageSchema]


# ------------------------------------------------------------------------------
# Curated Question Bank
# ------------------------------------------------------------------------------
DRILL_QUESTIONS: List[InterviewQuestion] = [
    InterviewQuestion(
        id="q1",
        category="System Architecture",
        difficulty="Senior / High Yield",
        targetTime="3-4 mins",
        question="How would you design a distributed cache layer using Redis for a high-traffic e-commerce checkout service? Specifically explain how you avoid cache stampede and ensure consistency.",
        rubricTips="Mention Cache-Aside vs Write-Through, Mutex/Locks for Stampede, TTL jitter, and invalidation strategies.",
        keyConcepts=["cache stampede", "mutex", "lock", "ttl jitter", "cache-aside", "consistency", "invalidation"],
    ),
    InterviewQuestion(
        id="q2",
        category="Frontend Deep Dive",
        difficulty="Mid-Senior",
        targetTime="2-3 mins",
        question="Explain how React 18 Concurrent Rendering and Server Components change data fetching compared to traditional client-side useEffect cascades.",
        rubricTips="Mention Suspense boundaries, streaming SSR, zero bundle impact of Server Components, and elimination of network waterfalls.",
        keyConcepts=["server components", "suspense", "streaming ssr", "waterfall", "concurrent", "bundle size"],
    ),
    InterviewQuestion(
        id="q3",
        category="Backend & Databases",
        difficulty="Mid-Senior",
        targetTime="3 mins",
        question="A mission-critical PostgreSQL query running on an orders table with 50M rows has slowed down to 8 seconds. How do you systematically diagnose, profile, and optimize it?",
        rubricTips="Discuss EXPLAIN ANALYZE, indexing (B-Tree/composite), connection pooling, table partitioning, and avoiding full sequential scans.",
        keyConcepts=["explain analyze", "index", "b-tree", "composite index", "sequential scan", "partitioning", "connection pooling"],
    ),
    InterviewQuestion(
        id="q4",
        category="Behavioral (STAR Method)",
        difficulty="Cultural Fit",
        targetTime="3 mins",
        question="Describe a time when you discovered a critical bug in production right before a project deadline. How did you triage, communicate, and resolve it?",
        rubricTips="Look for Situation, Task, Action (isolation, rollback/hotfix, stakeholder update), and Result (post-mortem, test automation).",
        keyConcepts=["situation", "triage", "rollback", "hotfix", "communication", "stakeholders", "post-mortem", "automated tests"],
    ),
    InterviewQuestion(
        id="q5",
        category="Cloud & Reliability",
        difficulty="Mid-Senior",
        targetTime="3 mins",
        question="How would you implement a sliding-window rate limiter across distributed API gateway instances without creating a single point of failure?",
        rubricTips="Discuss Redis sorted sets (ZSET), Lua scripting for atomicity, token bucket algorithms, and graceful fallback handling.",
        keyConcepts=["sliding window", "redis sorted set", "zset", "lua script", "atomicity", "token bucket", "rate limit"],
    ),
]


# ------------------------------------------------------------------------------
# Evaluation Algorithm
# ------------------------------------------------------------------------------
def evaluate_candidate_answer(
    question: InterviewQuestion,
    answer_text: str,
) -> RubricEvaluation:
    """
    Evaluates candidate answer against key concept keywords, depth, and structure.
    """
    clean_answer = answer_text.strip().lower()
    words = clean_answer.split()

    if len(words) < 8:
        return RubricEvaluation(
            score=40,
            strengths=["Attempted response."],
            missingConcepts=question.keyConcepts,
            rubricTips=question.rubricTips,
            feedback="The answer is too brief for an interview drill. Expand your thoughts with technical mechanisms and tradeoffs.",
            starMethodAssessment="Insufficient detail to evaluate STAR method structure.",
        )

    # Concept detection
    matched_concepts = [c for c in question.keyConcepts if c in clean_answer]
    missing_concepts = [c for c in question.keyConcepts if c not in clean_answer]

    concept_ratio = len(matched_concepts) / max(len(question.keyConcepts), 1)

    # Base scoring
    raw_score = 55 + int(concept_ratio * 40)

    # Length / depth bonus
    if len(words) >= 40:
        raw_score = min(raw_score + 5, 98)

    score = max(45, min(raw_score, 96))

    # Strengths
    strengths = []
    if matched_concepts:
        top_matches = ", ".join(matched_concepts[:3])
        strengths.append(f"Accurate terminology: Correctly referenced {top_matches}.")
    if len(words) >= 30:
        strengths.append("Structured technical articulation with clear conversational cadence.")
    if not strengths:
        strengths.append("Clear delivery and positive direction.")

    # Feedback
    if score >= 80:
        feedback = "Exceptional response! You demonstrated strong architectural intuition and addressed potential concurrency pitfalls."
    elif score >= 65:
        feedback = "Solid answer! To reach top tier, provide deeper elaboration on failure modes and edge cases."
    else:
        feedback = f"Good initial direction, but missed critical concepts. Be sure to highlight: {question.rubricTips}"

    # STAR assessment if behavioral
    star_assessment = None
    if "STAR" in question.category:
        has_situation = any(k in clean_answer for k in ["when", "during", "project", "time", "company"])
        has_action = any(k in clean_answer for k in ["i isolated", "i notified", "i fixed", "i implemented", "i communicated", "my role"])
        has_result = any(k in clean_answer for k in ["result", "reduced", "prevented", "learned", "delivered", "outcome"])
        if has_situation and has_action and has_result:
            star_assessment = "Strong STAR structure detected: clearly defined context, ownership action, and measurable outcome."
        else:
            star_assessment = "Partial STAR structure: Ensure you explicitly state the final business/technical outcome (Result)."

    return RubricEvaluation(
        score=score,
        strengths=strengths,
        missingConcepts=missing_concepts,
        rubricTips=question.rubricTips,
        feedback=feedback,
        starMethodAssessment=star_assessment,
    )


# ------------------------------------------------------------------------------
# API Endpoints
# ------------------------------------------------------------------------------
@router.get("/questions", response_model=List[InterviewQuestion], summary="List all drill questions")
async def list_questions(category: Optional[str] = None):
    """Retrieve available interview questions optionally filtered by category."""
    if category:
        return [q for q in DRILL_QUESTIONS if category.lower() in q.category.lower()]
    return DRILL_QUESTIONS


@router.post("/start", response_model=StartSessionResponse, summary="Start a new mock drill session")
async def start_session(
    payload: StartSessionRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Initializes a new mock interview session and returns the initial scenario question.
    """
    first_q = DRILL_QUESTIONS[0]

    session_record = InterviewSessionModel(
        candidate_name=payload.candidateName or "Candidate",
        target_role=payload.targetRole or "Full Stack Software Engineer",
        difficulty=payload.difficulty or "Mid-Senior",
        status="in-progress",
    )
    db.add(session_record)
    await db.flush()

    greeting = (
        f"Welcome to your AI Mock Interview session, {session_record.candidate_name}. "
        f"Today we're evaluating your technical depth for the {session_record.target_role} track. "
        f"Let's begin with our first scenario: {first_q.question}"
    )

    initial_msg = InterviewMessageModel(
        session_id=session_record.id,
        role="assistant",
        content=greeting,
    )
    db.add(initial_msg)
    await db.commit()

    return StartSessionResponse(
        sessionId=session_record.id,
        candidateName=session_record.candidate_name,
        targetRole=session_record.target_role,
        difficulty=session_record.difficulty,
        firstQuestion=first_q,
        greetingMessage=greeting,
    )


@router.post(
    "/{session_id}/answer",
    response_model=AnswerSubmissionResponse,
    summary="Submit candidate answer and get real-time rubric feedback",
)
async def submit_answer(
    session_id: str,
    payload: AnswerSubmissionRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Processes candidate answer, computes rubric scoring, records conversation in DB,
    and returns immediate feedback along with the next question.
    """
    # Verify session
    stmt = (
        select(InterviewSessionModel)
        .where(InterviewSessionModel.id == session_id)
        .options(selectinload(InterviewSessionModel.messages))
    )
    result = await db.execute(stmt)
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Interview session {session_id} not found.",
        )

    # Find matching question
    matching_q = next((q for q in DRILL_QUESTIONS if q.id == payload.questionId), None)
    if not matching_q:
        matching_q = DRILL_QUESTIONS[0]

    # Evaluate answer
    evaluation = evaluate_candidate_answer(matching_q, payload.answerText)

    # Save user message & feedback in DB
    user_msg = InterviewMessageModel(
        session_id=session.id,
        role="user",
        content=payload.answerText,
        score=float(evaluation.score),
        feedback={
            "strengths": evaluation.strengths,
            "missingConcepts": evaluation.missingConcepts,
            "feedback": evaluation.feedback,
            "tips": evaluation.rubricTips,
        },
    )
    db.add(user_msg)

    # Determine next question
    curr_index = next(
        (i for i, q in enumerate(DRILL_QUESTIONS) if q.id == matching_q.id), 0
    )
    next_q = None
    is_completed = False

    if curr_index + 1 < len(DRILL_QUESTIONS):
        next_q = DRILL_QUESTIONS[curr_index + 1]
        ai_reply = (
            f"Great response. Score: {evaluation.score}/100. {evaluation.feedback} "
            f"Now moving on to question {curr_index + 2}: {next_q.question}"
        )
    else:
        is_completed = True
        session.status = "completed"
        ai_reply = (
            f"Outstanding work! You've concluded all drill scenarios for this session. "
            f"Your overall technical evaluation score is ready."
        )

    # Record AI next prompt
    assistant_msg = InterviewMessageModel(
        session_id=session.id,
        role="assistant",
        content=ai_reply,
    )
    db.add(assistant_msg)

    # Update overall score average
    all_scores = [
        m.score
        for m in session.messages
        if m.role == "user" and m.score is not None
    ] + [float(evaluation.score)]
    session.overall_score = round(sum(all_scores) / len(all_scores), 1)

    await db.commit()

    return AnswerSubmissionResponse(
        sessionId=session.id,
        questionId=payload.questionId,
        evaluation=evaluation,
        nextQuestion=next_q,
        isCompleted=is_completed,
        aiResponseAudioCue=ai_reply,
    )


@router.get(
    "/{session_id}",
    response_model=SessionReportCard,
    summary="Get interview session scorecard & transcript",
)
async def get_session_scorecard(
    session_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Retrieve full transcript and final evaluation report card for a session."""
    stmt = (
        select(InterviewSessionModel)
        .where(InterviewSessionModel.id == session_id)
        .options(selectinload(InterviewSessionModel.messages))
    )
    result = await db.execute(stmt)
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Interview session {session_id} not found.",
        )

    answered_count = sum(1 for m in session.messages if m.role == "user")
    score = session.overall_score or 82.5

    if score >= 85:
        summary = "Candidate demonstrates senior-level system design instincts, deep understanding of caching mechanics, and STAR-compliant communication."
    elif score >= 70:
        summary = "Candidate demonstrates solid foundational knowledge with clear technical vocabulary, but needs deeper elaboration on high-traffic edge cases."
    else:
        summary = "Candidate demonstrates promising enthusiasm; recommends focusing on PostgreSQL query profiling and distributed consistency."

    return SessionReportCard(
        sessionId=session.id,
        candidateName=session.candidate_name,
        targetRole=session.target_role,
        difficulty=session.difficulty,
        overallScore=score,
        totalQuestionsAnswered=answered_count,
        summary=summary,
        messages=[
            MessageSchema(
                id=m.id,
                role=m.role,
                content=m.content,
                score=m.score,
                feedback=m.feedback,
                timestamp=m.timestamp.isoformat(),
            )
            for m in session.messages
        ],
    )
