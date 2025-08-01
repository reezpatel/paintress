"""Main FastAPI application for Notes App."""

import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from contextlib import asynccontextmanager
import os

from app.config import settings
from app.database import engine, Base
from app.routers import auth, config


import subprocess
import sys


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""

    # Run database migrations
    try:
        print("🔄 Running database migrations...")
        result = subprocess.run(
            [sys.executable, "-m", "alembic", "upgrade", "head"],
            capture_output=True,
            text=True,
            cwd=os.getcwd(),
        )
        if result.returncode == 0:
            print("✅ Database migrations completed successfully")
        else:
            print(f"⚠️  Migration warning: {result.stderr}")
    except Exception as e:
        print(f"⚠️  Could not run migrations: {e}")

    if not settings.enable_s3_storage:
        os.makedirs(settings.upload_directory, exist_ok=True)

    yield

    # Cleanup (if needed)
    pass


# Create FastAPI application
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="A REST API for a notes application with client-side encryption",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(GZipMiddleware, minimum_size=1000)
# Include routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(config.router, prefix="/api/v1")

# Serve static files
app.mount("/", StaticFiles(directory="static", html=True), name="static")


# Health check endpoint
@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    from app.database import test_database_connection

    db_info = test_database_connection()
    return {
        "status": "healthy",
        "version": settings.app_version,
        "database": db_info,
        "storage": "S3" if settings.enable_s3_storage else "Local",
    }


@app.get("/api/root")
async def root():
    """Root endpoint."""
    return {
        "message": "Notes App API",
        "version": settings.app_version,
        "docs": "/docs" if settings.debug else "Documentation disabled in production",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=settings.debug)
