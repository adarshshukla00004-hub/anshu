import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base


class InterviewSessionModel(Base):
    __tablename__ = "interview_sessions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    candidate_name = Column(String(100), default="Candidate")
    target_role = Column(String(100), default="Full Stack Software Engineer")
    difficulty = Column(String(50), default="Mid-Senior")
    status = Column(String(50), default="in-progress")  # in-progress, completed
    overall_score = Column(Float, default=0.0)
    summary = Column(Text, nullable=True)

    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    # Relationships
    messages = relationship(
        "InterviewMessageModel",
        back_populates="session",
        cascade="all, delete-orphan",
        order_by="InterviewMessageModel.timestamp",
    )


class InterviewMessageModel(Base):
    __tablename__ = "interview_messages"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(
        String(36), ForeignKey("interview_sessions.id", ondelete="CASCADE"), nullable=False
    )
    role = Column(String(20), nullable=False)  # assistant, user
    content = Column(Text, nullable=False)
    score = Column(Float, nullable=True)
    feedback = Column(JSON, nullable=True)
    rubric_breakdown = Column(JSON, nullable=True)

    timestamp = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    session = relationship("InterviewSessionModel", back_populates="messages")
