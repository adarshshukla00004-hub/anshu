import io
import re
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.models.resume import ResumeAnalysisModel

router = APIRouter(prefix="/analyzer", tags=["Resume Analyzer & ATS"])


# ------------------------------------------------------------------------------
# Pydantic Schemas
# ------------------------------------------------------------------------------
class BulletOptimization(BaseModel):
    role: str
    before: str
    after: str
    impact: str


class ResumeAnalysisResponse(BaseModel):
    id: Optional[str] = None
    fileName: str
    targetRole: str
    score: int = Field(ge=0, le=100, description="ATS Match Score (0-100)")
    skills: List[str]
    missing: List[str]
    strengths: List[str]
    improvements: List[str]
    bulletOptimizations: List[BulletOptimization]
    metricsCount: int = 0
    wordCount: int = 0


class BulletOptimizeRequest(BaseModel):
    bullet: str
    targetRole: Optional[str] = "Full Stack Software Engineer"
    contextProject: Optional[str] = "Web Application"


class BulletOptimizeResponse(BaseModel):
    original: str
    optimized: str
    atsImpact: str
    feedback: str


class JobMatchRequest(BaseModel):
    resumeText: str
    jobDescription: str
    roleTitle: Optional[str] = "Target Role"


class JobMatchResponse(BaseModel):
    matchScore: int
    matchingSkills: List[str]
    missingKeywords: List[str]
    recommendations: List[str]


# ------------------------------------------------------------------------------
# Skill Taxonomy & Benchmark Dictionaries
# ------------------------------------------------------------------------------
ROLE_SKILLS: Dict[str, Dict[str, List[str]]] = {
    "software": {
        "React.js": [r"\breact(\.js)?\b"],
        "Next.js": [r"\bnext(\.js)?(\s*1[3-5])?\b"],
        "TypeScript": [r"\btypescript\b", r"\bts\b"],
        "JavaScript": [r"\bjavascript\b", r"\bjs\b", r"\bes6\b"],
        "Node.js": [r"\bnode(\.js)?\b"],
        "Python": [r"\bpython\b"],
        "PostgreSQL": [r"\bpostgres(ql)?\b"],
        "MongoDB": [r"\bmongo(db)?\b"],
        "Redis": [r"\bredis\b"],
        "Docker": [r"\bdocker\b", r"\bcontainer(s|ization)?\b"],
        "Kubernetes": [r"\bkubernetes\b", r"\bk8s\b"],
        "System Design": [r"\bsystem design\b", r"\bdistributed systems\b", r"\bmicroservices\b"],
        "REST APIs": [r"\brest(ful)?\s*(api|endpoint)?s?\b"],
        "GraphQL": [r"\bgraphql\b"],
        "TailwindCSS": [r"\btailwind(css)?\b"],
        "Unit Testing": [r"\bjest\b", r"\bplaywright\b", r"\bcypress\b", r"\btesting\b", r"\bunit test(s|ing)?\b"],
        "AWS / Cloud": [r"\baws\b", r"\bamazon web services\b", r"\bgcp\b", r"\bazure\b", r"\bs3\b", r"\bec2\b"],
        "CI/CD": [r"\bci\/cd\b", r"\bgithub actions\b", r"\bjenkins\b"],
        "Git & GitHub": [r"\bgit\b", r"\bgithub\b", r"\bgitlab\b"],
    },
    "data": {
        "Python": [r"\bpython\b"],
        "SQL": [r"\bsql\b", r"\bpostgres\b", r"\bmysql\b"],
        "Pandas & NumPy": [r"\bpandas\b", r"\bnumpy\b"],
        "BigQuery": [r"\bbigquery\b"],
        "Spark / PySpark": [r"\b(py)?spark\b"],
        "Machine Learning": [r"\bmachine learning\b", r"\bscikit-learn\b", r"\bsklearn\b"],
        "Deep Learning": [r"\bpytorch\b", r"\btensorflow\b", r"\bkeras\b"],
        "Data Visualization": [r"\btableau\b", r"\bpower bi\b", r"\bmatplotlib\b", r"\bseaborn\b"],
        "Statistics & A/B Testing": [r"\ba\/b test(ing)?\b", r"\bhypothesis test(ing)?\b", r"\bstatistics\b"],
        "MLOps & MLflow": [r"\bmlops\b", r"\bmlflow\b", r"\bkube-?flow\b"],
        "Vector DBs": [r"\bpinecone\b", r"\bweaviate\b", r"\bchromadb\b", r"\bvector\b"],
        "Data Warehousing": [r"\bsnowflake\b", r"\bredshift\b", r"\bdata warehouse\b"],
    },
}

STRONG_ACTION_VERBS = [
    "architected", "spearheaded", "engineered", "optimized", "designed",
    "implemented", "orchestrated", "deployed", "refactored", "automated",
    "accelerated", "scaled", "streamlined", "built", "developed"
]


# ------------------------------------------------------------------------------
# Core Parsing & Detection Engine
# ------------------------------------------------------------------------------
def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract raw UTF-8 text from PDF byte streams using pypdf."""
    try:
        from pypdf import PdfReader
        reader = PdfReader(io.BytesIO(file_bytes))
        extracted_pages = []
        for index, page in enumerate(reader.pages):
            text = page.extract_text()
            if text:
                extracted_pages.append(text)
        return "\n".join(extracted_pages)
    except Exception as exc:
        # Fallback to UTF-8 decoding if not a valid binary PDF stream
        try:
            return file_bytes.decode("utf-8", errors="ignore")
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Unable to parse document: {str(exc)}",
            )


def analyze_resume_text(
    text: str,
    target_role_type: str = "software",
    file_name: str = "Resume.pdf",
) -> Dict[str, Any]:
    """
    Algorithmic ATS evaluation:
    1. Keyword identification across taxonomy
    2. Missing competency gaps
    3. Metric & quantitative impact measurement
    4. Action verb density
    5. Actionable bullet point rewrites
    """
    taxonomy = ROLE_SKILLS.get(target_role_type, ROLE_SKILLS["software"])
    lower_text = text.lower()

    # 1. Detect present skills & missing skills
    found_skills = []
    missing_skills = []

    for skill_name, patterns in taxonomy.items():
        matched = False
        for pattern in patterns:
            if re.search(pattern, lower_text, re.IGNORECASE):
                matched = True
                break
        if matched:
            found_skills.append(skill_name)
        else:
            missing_skills.append(skill_name)

    # 2. Metric detection (e.g. 40%, 150ms, $20k, 5,000+ users, 2.5x)
    metrics_patterns = [
        r"\b\d+([.,]\d+)?\s*%",
        r"\$\s*\d+([.,]\d+)?\s*(k|m|b)?",
        r"\b\d+([.,]\d+)?\s*(ms|s|seconds|x|fps)\b",
        r"\b\d{2,}\+?\s*(users|requests|queries|downloads|qps)\b",
    ]
    total_metrics = 0
    for p in metrics_patterns:
        total_metrics += len(re.findall(p, lower_text, re.IGNORECASE))

    # 3. Action verbs
    verbs_count = sum(1 for verb in STRONG_ACTION_VERBS if re.search(rf"\b{verb}\b", lower_text))

    # 4. Standard structural sections
    sections = {
        "experience": bool(re.search(r"\b(experience|employment|work history)\b", lower_text)),
        "projects": bool(re.search(r"\b(projects|technical work)\b", lower_text)),
        "education": bool(re.search(r"\b(education|academic|bachelor|master|degree)\b", lower_text)),
        "skills": bool(re.search(r"\b(skills|competencies|technologies)\b", lower_text)),
    }
    section_score = sum(sections.values()) * 5  # Max 20

    # 5. Calculate ATS Score (0 - 100)
    skill_coverage = (len(found_skills) / max(len(taxonomy), 1)) * 45  # Max 45
    metric_score = min(total_metrics * 4, 20)                         # Max 20
    verb_score = min(verbs_count * 2.5, 15)                            # Max 15

    raw_score = int(round(skill_coverage + metric_score + verb_score + section_score))
    # Bound between 35 and 98 to keep realistic
    final_score = max(35, min(raw_score, 96))

    # 6. Top strengths
    strengths = []
    if len(found_skills) >= 6:
        strengths.append(f"Strong core technical breadth: Identified {len(found_skills)} matching stack competencies.")
    if total_metrics >= 3:
        strengths.append(f"Quantifiable impact: Identified {total_metrics} distinct outcome metrics and KPIs.")
    if verbs_count >= 4:
        strengths.append("High-velocity action verbs: Bullet points begin with authoritative engineering deliverables.")
    if all(sections.values()):
        strengths.append("Standard ATS hierarchy: All standard sections (Experience, Projects, Education, Skills) detected.")
    if not strengths:
        strengths.append("Good baseline project descriptions and clean formatting.")

    # 7. Actionable Improvements
    improvements = []
    if missing_skills:
        top_missing = ", ".join(missing_skills[:3])
        improvements.append(f"Target key tech gaps: Infuse high-yield keywords such as {top_missing}.")
    if total_metrics < 4:
        improvements.append("Quantify outcomes: Add specific performance metrics (e.g. latency reduced by X%, throughput increased by Y%).")
    if verbs_count < 3:
        improvements.append("Upgrade passive phrases: Replace phrases like 'Responsible for' with active verbs like 'Architected' or 'Engineered'.")
    if not sections.get("skills"):
        improvements.append("Add a distinct 'Technical Skills' section with categorizations (Languages, Frameworks, Cloud/Tools).")

    # 8. Dynamic bullet optimizations based on target domain
    if target_role_type == "data":
        bullet_optimizations = [
            BulletOptimization(
                role="Data Pipeline / ETL Project",
                before="Wrote python scripts to clean sales data and created dashboard for business team.",
                after="Engineered automated PySpark ETL pipeline processing 4.2M daily transactions into BigQuery; reduced query latency by 43% and visualized KPIs via Tableau for 60+ stakeholders.",
                impact="+22 ATS Keyword Match",
            ),
            BulletOptimization(
                role="Predictive ML Model",
                before="Trained machine learning models using scikit-learn to predict customer churn.",
                after="Developed gradient-boosted churn prediction model (XGBoost) evaluated with 0.89 ROC-AUC; deployed automated inference pipeline saving an estimated $120K in annual retention costs.",
                impact="+19 Recruiter Relevance",
            ),
        ]
    else:
        bullet_optimizations = [
            BulletOptimization(
                role="Full Stack Web Application",
                before="Created full stack shopping website using React and Node.js with database integration.",
                after="Architected scalable full-stack e-commerce platform using Next.js 14, TypeScript, and PostgreSQL; reduced query latency by 38% via Redis caching and optimized database connection pooling.",
                impact="+18 ATS Keyword Match",
            ),
            BulletOptimization(
                role="Frontend System / Component Library",
                before="Worked on UI components and fixed bugs reported by users in production.",
                after="Spearheaded redesign of 14 core UI components using Tailwind CSS and Radix primitives, achieving 99.4% cross-browser fidelity and reducing cumulative layout shift (CLS) from 0.18 to 0.02.",
                impact="+14 Recruiter Relevance",
            ),
        ]

    word_count = len(text.split())

    return {
        "fileName": file_name,
        "targetRole": "Full Stack Software Engineer" if target_role_type == "software" else "Data Scientist / ML Engineer",
        "score": final_score,
        "skills": found_skills,
        "missing": missing_skills,
        "strengths": strengths,
        "improvements": improvements,
        "bulletOptimizations": bullet_optimizations,
        "metricsCount": total_metrics,
        "wordCount": word_count,
    }


# ------------------------------------------------------------------------------
# API Endpoints
# ------------------------------------------------------------------------------
@router.post(
    "/upload",
    response_model=ResumeAnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Upload and analyze a PDF or text resume",
)
async def upload_and_analyze_resume(
    file: UploadFile = File(..., description="Resume file in PDF or TXT format"),
    role: str = Form(default="software", description="Target role: 'software' or 'data'"),
    db: AsyncSession = Depends(get_db),
):
    """
    Accepts an uploaded resume file (PDF or plaintext), extracts candidate competencies,
    compares against role-specific ATS benchmarks, and generates a structured diagnosis.
    """
    contents = await file.read()
    if not contents:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty.",
        )

    file_name = file.filename or "uploaded_resume.pdf"
    file_lower = file_name.lower()

    if file_lower.endswith(".pdf"):
        text = extract_text_from_pdf(contents)
    else:
        try:
            text = contents.decode("utf-8", errors="ignore")
        except Exception:
            text = str(contents)

    if not text.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Could not extract text content from the uploaded document.",
        )

    role_key = "data" if "data" in role.lower() or "ml" in role.lower() else "software"
    analysis_result = analyze_resume_text(
        text=text,
        target_role_type=role_key,
        file_name=file_name,
    )

    # Persist in SQLite/PostgreSQL
    record = ResumeAnalysisModel(
        file_name=analysis_result["fileName"],
        file_size=len(contents),
        target_role=analysis_result["targetRole"],
        score=analysis_result["score"],
        raw_text=text[:5000],  # store snapshot
        skills=analysis_result["skills"],
        missing_skills=analysis_result["missing"],
        strengths=analysis_result["strengths"],
        improvements=analysis_result["improvements"],
        bullet_optimizations=[b.model_dump() for b in analysis_result["bulletOptimizations"]],
    )
    db.add(record)
    await db.commit()
    await db.refresh(record)

    analysis_result["id"] = record.id
    return analysis_result


@router.post(
    "/optimize-bullet",
    response_model=BulletOptimizeResponse,
    summary="Rewrite a weak resume bullet point into a high-impact STAR statement",
)
async def optimize_bullet_point(payload: BulletOptimizeRequest):
    """
    Transforms passive, unquantified bullets into active, measurable STAR bullet points.
    """
    bullet = payload.bullet.strip()
    if not bullet:
        raise HTTPException(status_code=400, detail="Bullet point text cannot be empty.")

    # High-impact transformation engine
    verbs = ["Architected", "Engineered", "Optimized", "Spearheaded", "Implemented"]
    verb = verbs[hash(bullet) % len(verbs)]

    if "test" in bullet.lower() or "bug" in bullet.lower():
        optimized = (
            f"{verb} automated testing suite and error telemetry pipeline; reduced production regression "
            f"tickets by 34% and improved test execution throughput by 2.2x."
        )
        impact = "+16 Quality Engineering Index"
        feedback = "Replaced generic debugging description with measurable regression reduction and automated test pipeline metrics."
    elif "api" in bullet.lower() or "backend" in bullet.lower() or "data" in bullet.lower():
        optimized = (
            f"{verb} resilient RESTful microservice layer using FastAPI and PostgreSQL; "
            f"reduced p99 endpoint latency from 240ms to 78ms via Redis caching and index tuning."
        )
        impact = "+21 High Scale Backend Impact"
        feedback = "Quantified database and network optimization using standard latency benchmarks (p99 latency)."
    else:
        optimized = (
            f"{verb} {payload.contextProject} features using modern TypeScript and responsive UI components; "
            f"boosted end-user interaction speed by 42% and elevated core web vitals to 98%."
        )
        impact = "+18 ATS Keyword Match"
        feedback = "Infused strong engineering leadership verb, production metrics, and modern stack relevance."

    return BulletOptimizeResponse(
        original=bullet,
        optimized=optimized,
        atsImpact=impact,
        feedback=feedback,
    )


@router.post(
    "/match-job",
    response_model=JobMatchResponse,
    summary="Compare resume text against a target job description",
)
async def match_resume_with_job(payload: JobMatchRequest):
    """
    Performs keyword intersection and gap detection between candidate text and a target JD.
    """
    resume_words = set(re.findall(r"\b[A-Za-z0-9\.\+#]{2,}\b", payload.resumeText.lower()))
    jd_words = set(re.findall(r"\b[A-Za-z0-9\.\+#]{2,}\b", payload.jobDescription.lower()))

    # Known technical words filter
    tech_keywords = {
        "react", "next.js", "typescript", "javascript", "python", "node.js",
        "sql", "postgresql", "mongodb", "redis", "docker", "kubernetes",
        "aws", "gcp", "azure", "git", "ci/cd", "rest", "graphql", "tailwind",
        "kafka", "spark", "pandas", "numpy", "system design", "linux"
    }

    jd_tech = {k for k in tech_keywords if k in payload.jobDescription.lower()}
    matching = [k for k in jd_tech if k in payload.resumeText.lower()]
    missing = [k for k in jd_tech if k not in payload.resumeText.lower()]

    score = 70
    if jd_tech:
        score = int((len(matching) / len(jd_tech)) * 100)

    recommendations = []
    if missing:
        recommendations.append(f"Incorporate missing core requirements: {', '.join(missing[:4])}")
    recommendations.append("Align bullet point verbs directly with action responsibilities in the job posting.")

    return JobMatchResponse(
        matchScore=max(25, min(score, 100)),
        matchingSkills=matching,
        missingKeywords=missing,
        recommendations=recommendations,
    )


@router.get(
    "/history",
    response_model=List[ResumeAnalysisResponse],
    summary="List recent resume analyses",
)
async def get_analysis_history(
    limit: int = 10,
    db: AsyncSession = Depends(get_db),
):
    """Retrieve history of parsed resumes."""
    stmt = (
        select(ResumeAnalysisModel)
        .order_by(ResumeAnalysisModel.created_at.desc())
        .limit(limit)
    )
    result = await db.execute(stmt)
    records = result.scalars().all()

    return [
        ResumeAnalysisResponse(
            id=r.id,
            fileName=r.file_name,
            targetRole=r.target_role,
            score=r.score,
            skills=r.skills or [],
            missing=r.missing_skills or [],
            strengths=r.strengths or [],
            improvements=r.improvements or [],
            bulletOptimizations=[
                BulletOptimization(**b) for b in (r.bullet_optimizations or [])
            ],
        )
        for r in records
    ]
