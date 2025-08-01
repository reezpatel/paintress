from fastapi import APIRouter
from app.config import settings
from app.schemas import ApplicationConfig

router = APIRouter(prefix="/config", tags=["config"])


@router.get("/", response_model=ApplicationConfig)
async def get_application_config():
    """Get application configuration including auth type."""
    auth_type = "clerk" if settings.enable_clerk else "traditional"

    return {
        "auth_type": auth_type,
        "app_name": settings.app_name,
        "version": settings.app_version,
    }
