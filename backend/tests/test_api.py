import pytest
from app.api.analyzer import analyze_resume_text
from app.api.interview import DRILL_QUESTIONS, evaluate_candidate_answer
from app.api.roadmap import build_default_milestones


def test_resume_analysis_software():
    sample_resume = """
    Software Engineer with experience in React.js, TypeScript, Next.js, Node.js, and PostgreSQL.
    Architected high-scale web platform reducing latency by 40% and serving 10,000+ users.
    Education: B.S. in Computer Science.
    Experience: Full Stack Developer at Tech Corp.
    Projects: E-Commerce store built with React and REST APIs.
    """
    result = analyze_resume_text(sample_resume, target_role_type="software", file_name="test.pdf")
    
    assert result["score"] > 60
    assert "React.js" in result["skills"]
    assert "TypeScript" in result["skills"]
    assert len(result["strengths"]) > 0
    assert len(result["bulletOptimizations"]) > 0


def test_interview_rubric_evaluation():
    question = DRILL_QUESTIONS[0]
    answer = (
        "To avoid cache stampede, I would use a distributed mutex lock so that only one worker queries "
        "the database while other requests wait or serve stale data. I also add TTL jitter to prevent "
        "all keys from expiring at the same time."
    )
    eval_result = evaluate_candidate_answer(question, answer)
    assert eval_result.score >= 70
    assert len(eval_result.strengths) > 0


def test_roadmap_curriculum_generation():
    missing = ["System Design (Caching/Redis)", "Docker & Containerization"]
    milestones = build_default_milestones(missing)
    assert len(milestones) == 5
    assert milestones[0]["stepNumber"] == 1
    assert any("Redis" in str(m["skillsGained"]) for m in milestones)
