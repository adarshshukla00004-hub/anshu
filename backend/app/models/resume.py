import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Text, DateTime, JSON
from app.core.database import Base


class ResumeAnalysisModel(Base):
    __tablename__ = "resume_analyses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    file_name = Column(String(255), nullable=False)
    file_size = Column(Integer, default=0)
    target_role = Column(String(100), default="Full Stack Software Engineer")
    score = Column(Integer, nullable=False)
    raw_text = Column(Text, nullable=True)

    # Structured ATS diagnostics stored as JSON arrays / objects
    skills = Column(JSON, default=list)
    missing_skills = Column(JSON, default=list)
    strengths = Column(JSON, default=list)
    improvements = Column(JSON, default=list)
    bullet_optimizations = Column(JSON, default=list)

    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
