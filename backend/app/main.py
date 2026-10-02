from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

from app.core.config import settings
from app.core.database import init_db
from app.api import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager:
    - Runs on startup: initializes async database tables
    - Runs on shutdown: cleans up resources if needed
    """
    # Startup
    try:
        await init_db()
    except Exception as exc:
        print(f"[Warning] Database initialization notice: {exc}")
    yield
    # Shutdown


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="High-performance backend API powering ATS Resume Diagnostics, Voice AI Mock Interview Drills, and Dynamic Milestone Roadmaps.",
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ------------------------------------------------------------------------------
# CORS Middleware
# ------------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ------------------------------------------------------------------------------
# Global Exception Handlers
# ------------------------------------------------------------------------------
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Unified error response for unhandled exceptions."""
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": "InternalServerError",
            "message": str(exc) if settings.DEBUG else "An unexpected server error occurred.",
            "path": str(request.url.path),
        },
    )


# ------------------------------------------------------------------------------
# System & Health Check Endpoints
# ------------------------------------------------------------------------------
@app.get("/", tags=["Health Check"])
async def root():
    """Root status verification."""
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "docs": "/docs",
        "apiPrefix": settings.API_V1_PREFIX,
    }


@app.get("/health", tags=["Health Check"])
async def health_check():
    """Service liveness probe."""
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
        "debug": settings.DEBUG,
    }


# ------------------------------------------------------------------------------
# Mount Versioned API Routes
# ------------------------------------------------------------------------------
app.include_router(api_router, prefix=settings.API_V1_PREFIX)


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )
