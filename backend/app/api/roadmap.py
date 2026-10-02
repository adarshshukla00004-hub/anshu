import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.models.roadmap import RoadmapModel, MilestoneModel, TaskModel

router = APIRouter(prefix="/roadmap", tags=["Dynamic Roadmap & Milestones"])


# ------------------------------------------------------------------------------
# Pydantic Schemas
# ------------------------------------------------------------------------------
class TaskSchema(BaseModel):
    id: str
    title: str
    completed: bool
    resourceTitle: Optional[str] = None
    resourceLink: Optional[str] = None


class MilestoneSchema(BaseModel):
    id: str
    stepNumber: int
    phase: str
    title: str
    description: str
    status: str  # "completed" | "in-progress" | "locked"
    estimatedHours: int
    skillsGained: List[str]
    tasks: List[TaskSchema]


class RoadmapSchema(BaseModel):
    id: str
    title: str
    targetRole: str
    totalHours: int
    milestones: List[MilestoneSchema]


class GenerateRoadmapRequest(BaseModel):
    targetRole: Optional[str] = "Full Stack Software Engineer"
    missingSkills: Optional[List[str]] = Field(
        default_factory=lambda: [
            "System Design (Caching/Redis)",
            "Docker & Containerization",
            "Unit Testing (Jest/Playwright)",
            "AWS S3 / Cloud Deployment",
        ]
    )
    currentExperience: Optional[str] = "Student / Junior"
    weeklyCommitmentHours: Optional[int] = 15


class TaskToggleResponse(BaseModel):
    taskId: str
    completed: bool
    message: str


# ------------------------------------------------------------------------------
# Curriculum Generator Engine
# ------------------------------------------------------------------------------
def build_default_milestones(missing_skills: List[str]) -> List[dict]:
    """Generates 5 tailored milestones matching modern engineering tracks."""
    has_system_design = any("caching" in s.lower() or "system design" in s.lower() or "redis" in s.lower() for s in missing_skills)
    has_docker = any("docker" in s.lower() or "kubernetes" in s.lower() for s in missing_skills)
    has_testing = any("test" in s.lower() or "jest" in s.lower() for s in missing_skills)
    has_cloud = any("aws" in s.lower() or "cloud" in s.lower() or "s3" in s.lower() for s in missing_skills)

    # Phase 3 dynamically focuses on candidate gaps
    phase_3_skills = []
    if has_system_design:
        phase_3_skills.extend(["Redis Caching", "System Design"])
    if has_docker:
        phase_3_skills.append("Docker")
    if not phase_3_skills:
        phase_3_skills = ["Redis Caching", "Docker", "Rate Limiting", "System Design"]

    return [
        {
            "stepNumber": 1,
            "phase": "Phase 1: Foundations",
            "title": "Modern TypeScript & Advanced Asynchronous Architecture",
            "description": "Master strict typing, generic utility types, async event loops, promises, and error boundary handling.",
            "status": "completed",
            "estimatedHours": 14,
            "skillsGained": ["TypeScript Generics", "Async/Await", "Strict Type Guards"],
            "tasks": [
                {
                    "title": "Complete Advanced TypeScript Generics kata",
                    "completed": True,
                    "resourceTitle": "TS Handbook",
                    "resourceLink": "https://www.typescriptlang.org/docs/",
                },
                {
                    "title": "Implement custom event-emitter with type safety",
                    "completed": True,
                    "resourceTitle": "GitHub Pattern",
                    "resourceLink": "https://github.com",
                },
                {
                    "title": "Set up strict tsconfig.json rules with ESLint",
                    "completed": True,
                    "resourceTitle": "ESLint Config Guide",
                    "resourceLink": "https://eslint.org",
                },
            ],
        },
        {
            "stepNumber": 2,
            "phase": "Phase 2: Core Stack",
            "title": "Next.js 14 App Router & Relational Database Modeling",
            "description": "Build robust full-stack applications leveraging Server Components, Server Actions, and PostgreSQL with Prisma or SQLAlchemy.",
            "status": "completed",
            "estimatedHours": 22,
            "skillsGained": ["Next.js 14", "PostgreSQL", "Prisma ORM", "Server Actions"],
            "tasks": [
                {
                    "title": "Model multi-tenant database schema in PostgreSQL",
                    "completed": True,
                    "resourceTitle": "Postgres Guide",
                    "resourceLink": "https://www.postgresql.org/docs/",
                },
                {
                    "title": "Implement zero-waterfall data fetching with React Suspense",
                    "completed": True,
                    "resourceTitle": "React Documentation",
                    "resourceLink": "https://react.dev",
                },
                {
                    "title": "Build secure authentication flow with session management",
                    "completed": True,
                    "resourceTitle": "Auth Best Practices",
                    "resourceLink": "https://owasp.org",
                },
            ],
        },
        {
            "stepNumber": 3,
            "phase": "Phase 3: High Scale & Architecture",
            "title": "Distributed Caching (Redis), Rate Limiting & Docker",
            "description": f"Directly addresses candidate resume skill gaps: in-memory caching to eliminate latency bottlenecks, rate-limiting algorithms, and containerizing services.",
            "status": "in-progress",
            "estimatedHours": 18,
            "skillsGained": phase_3_skills,
            "tasks": [
                {
                    "title": "Deploy Redis cluster locally and integrate cache-aside pattern",
                    "completed": True,
                    "resourceTitle": "Redis University",
                    "resourceLink": "https://university.redis.com",
                },
                {
                    "title": "Implement sliding-window rate limiter middleware",
                    "completed": False,
                    "resourceTitle": "System Design Primer",
                    "resourceLink": "https://github.com/donnemartin/system-design-primer",
                },
                {
                    "title": "Write multi-stage Dockerfile and docker-compose orchestration",
                    "completed": False,
                    "resourceTitle": "Docker Docs",
                    "resourceLink": "https://docs.docker.com",
                },
                {
                    "title": "Benchmark API endpoint throughput under 500 concurrent connections",
                    "completed": False,
                    "resourceTitle": "Autocannon / k6",
                    "resourceLink": "https://k6.io",
                },
            ],
        },
        {
            "stepNumber": 4,
            "phase": "Phase 4: Cloud & Reliability",
            "title": "Automated CI/CD Pipelines & Cloud Storage Integration",
            "description": "Set up GitHub Actions testing workflows, cloud bucket asset storage (AWS S3/GCS), and automated smoke test verifications.",
            "status": "locked",
            "estimatedHours": 16,
            "skillsGained": ["GitHub Actions", "AWS S3", "Playwright", "Smoke Testing"],
            "tasks": [
                {
                    "title": "Configure GitHub Actions runner with automated lint and unit testing",
                    "completed": False,
                    "resourceTitle": "GitHub Actions Guide",
                    "resourceLink": "https://docs.github.com/en/actions",
                },
                {
                    "title": "Implement presigned S3 upload URLs with mime-type validation",
                    "completed": False,
                    "resourceTitle": "AWS SDK Presigned Docs",
                    "resourceLink": "https://aws.amazon.com/s3/",
                },
                {
                    "title": "Set up automated Playwright E2E smoke tests",
                    "completed": False,
                    "resourceTitle": "Playwright Docs",
                    "resourceLink": "https://playwright.dev",
                },
            ],
        },
        {
            "stepNumber": 5,
            "phase": "Phase 5: Placement Capstone",
            "title": "Production SaaS Capstone & AI Mock Interview Mastery",
            "description": "Tie all technologies together into a flagship production capstone project with live documentation and interview pitch drills.",
            "status": "locked",
            "estimatedHours": 24,
            "skillsGained": ["Portfolio Capstone", "System Pitch", "Technical Communication"],
            "tasks": [
                {
                    "title": "Publish open-source repository with comprehensive README & architecture diagrams",
                    "completed": False,
                    "resourceTitle": "Open Source Guide",
                    "resourceLink": "https://opensource.guide",
                },
                {
                    "title": "Complete 5 Voice AI mock interview rounds with >85% STAR rubric score",
                    "completed": False,
                    "resourceTitle": "STAR Interview Guide",
                    "resourceLink": "https://en.wikipedia.org/wiki/Situation,_task,_action_and_result",
                },
                {
                    "title": "Submit 10 targeted internship applications via Internship Matcher",
                    "completed": False,
                    "resourceTitle": "Internship Portal",
                    "resourceLink": "https://github.com",
                },
            ],
        },
    ]


# ------------------------------------------------------------------------------
# API Endpoints
# ------------------------------------------------------------------------------
@router.post(
    "/generate",
    response_model=RoadmapSchema,
    status_code=status.HTTP_201_CREATED,
    summary="Generate a personalized dynamic milestone roadmap",
)
async def generate_dynamic_roadmap(
    payload: GenerateRoadmapRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Synthesizes custom milestones and tasks derived from candidate skill gaps.
    Saves and returns the complete learning path.
    """
    raw_milestones = build_default_milestones(payload.missingSkills or [])
    total_hours = sum(m["estimatedHours"] for m in raw_milestones)

    roadmap_record = RoadmapModel(
        title=f"{payload.targetRole} Acceleration Track",
        target_role=payload.targetRole,
        total_hours=total_hours,
    )
    db.add(roadmap_record)
    await db.flush()

    response_milestones = []

    for m_data in raw_milestones:
        milestone = MilestoneModel(
            roadmap_id=roadmap_record.id,
            step_number=m_data["stepNumber"],
            phase=m_data["phase"],
            title=m_data["title"],
            description=m_data["description"],
            status=m_data["status"],
            estimated_hours=m_data["estimatedHours"],
            skills_gained=m_data["skillsGained"],
        )
        db.add(milestone)
        await db.flush()

        task_schemas = []
        for t_data in m_data["tasks"]:
            task = TaskModel(
                milestone_id=milestone.id,
                title=t_data["title"],
                completed=t_data["completed"],
                resource_title=t_data.get("resourceTitle"),
                resource_link=t_data.get("resourceLink"),
            )
            db.add(task)
            await db.flush()

            task_schemas.append(
                TaskSchema(
                    id=task.id,
                    title=task.title,
                    completed=task.completed,
                    resourceTitle=task.resource_title,
                    resourceLink=task.resource_link,
                )
            )

        response_milestones.append(
            MilestoneSchema(
                id=milestone.id,
                stepNumber=milestone.step_number,
                phase=milestone.phase,
                title=milestone.title,
                description=milestone.description,
                status=milestone.status,
                estimatedHours=milestone.estimated_hours,
                skillsGained=milestone.skills_gained,
                tasks=task_schemas,
            )
        )

    await db.commit()

    return RoadmapSchema(
        id=roadmap_record.id,
        title=roadmap_record.title,
        targetRole=roadmap_record.target_role,
        totalHours=total_hours,
        milestones=response_milestones,
    )


@router.get(
    "/{roadmap_id}",
    response_model=RoadmapSchema,
    summary="Get roadmap details by ID",
)
async def get_roadmap(
    roadmap_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Fetches roadmap details with all associated milestones and tasks."""
    stmt = (
        select(RoadmapModel)
        .where(RoadmapModel.id == roadmap_id)
        .options(
            selectinload(RoadmapModel.milestones).selectinload(MilestoneModel.tasks)
        )
    )
    result = await db.execute(stmt)
    roadmap = result.scalar_one_or_none()

    if not roadmap:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Roadmap with id '{roadmap_id}' was not found.",
        )

    return RoadmapSchema(
        id=roadmap.id,
        title=roadmap.title,
        targetRole=roadmap.target_role,
        totalHours=roadmap.total_hours,
        milestones=[
            MilestoneSchema(
                id=m.id,
                stepNumber=m.step_number,
                phase=m.phase,
                title=m.title,
                description=m.description,
                status=m.status,
                estimatedHours=m.estimated_hours,
                skillsGained=m.skills_gained or [],
                tasks=[
                    TaskSchema(
                        id=t.id,
                        title=t.title,
                        completed=t.completed,
                        resourceTitle=t.resource_title,
                        resourceLink=t.resource_link,
                    )
                    for t in m.tasks
                ],
            )
            for m in roadmap.milestones
        ],
    )


@router.patch(
    "/task/{task_id}/toggle",
    response_model=TaskToggleResponse,
    summary="Toggle task completion state",
)
async def toggle_task_completion(
    task_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Toggles task status between completed and incomplete."""
    stmt = select(TaskModel).where(TaskModel.id == task_id)
    result = await db.execute(stmt)
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID '{task_id}' not found.",
        )

    task.completed = not task.completed
    await db.commit()

    return TaskToggleResponse(
        taskId=task.id,
        completed=task.completed,
        message=f"Task marked as {'completed' if task.completed else 'incomplete'}.",
    )
