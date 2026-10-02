import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Boolean, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base


class RoadmapModel(Base):
    __tablename__ = "roadmaps"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(200), nullable=False)
    target_role = Column(String(100), default="Full Stack Software Engineer")
    total_hours = Column(Integer, default=0)

    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    milestones = relationship(
        "MilestoneModel",
        back_populates="roadmap",
        cascade="all, delete-orphan",
        order_by="MilestoneModel.step_number",
    )


class MilestoneModel(Base):
    __tablename__ = "milestones"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    roadmap_id = Column(
        String(36), ForeignKey("roadmaps.id", ondelete="CASCADE"), nullable=False
    )
    step_number = Column(Integer, nullable=False)
    phase = Column(String(100), nullable=False)  # Phase 1: Foundations, etc.
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String(50), default="locked")  # locked, in-progress, completed
    estimated_hours = Column(Integer, default=10)
    skills_gained = Column(JSON, default=list)

    roadmap = relationship("RoadmapModel", back_populates="milestones")
    tasks = relationship(
        "TaskModel",
        back_populates="milestone",
        cascade="all, delete-orphan",
    )


class TaskModel(Base):
    __tablename__ = "milestone_tasks"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    milestone_id = Column(
        String(36), ForeignKey("milestones.id", ondelete="CASCADE"), nullable=False
    )
    title = Column(String(255), nullable=False)
    completed = Column(Boolean, default=False)
    resource_title = Column(String(200), nullable=True)
    resource_link = Column(String(500), nullable=True)

    milestone = relationship("MilestoneModel", back_populates="tasks")
