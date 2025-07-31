"""Database configuration and session management."""

from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from .config import settings


def create_schema_if_not_exists(engine):
    """Create paintress schema if it doesn't exist."""
    try:
        with engine.connect() as connection:
            connection.execute(text("CREATE SCHEMA IF NOT EXISTS paintress"))
            connection.commit()
    except Exception as e:
        print(f"Warning: Could not create schema: {e}")


def create_database_engine():
    """Create database engine with appropriate configuration."""
    database_url = settings.database_url

    # Configure engine based on database type
    if "sqlite" in database_url:
        # SQLite configuration
        engine = create_engine(
            database_url,
            connect_args={"check_same_thread": False, "timeout": 20},
            poolclass=StaticPool,
            pool_pre_ping=True,
            echo=settings.debug,
        )
    elif "postgresql" in database_url:
        # PostgreSQL configuration with paintress schema
        engine = create_engine(
            database_url,
            pool_size=10,
            max_overflow=20,
            pool_pre_ping=True,
            pool_recycle=3600,
            echo=settings.debug,
            connect_args={"options": "-c search_path=paintress"},
        )
        # Create schema if it doesn't exist
        create_schema_if_not_exists(engine)
    else:
        # Generic configuration
        engine = create_engine(database_url, pool_pre_ping=True, echo=settings.debug)

    return engine


# Create SQLAlchemy engine
engine = create_database_engine()

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class for models
Base = declarative_base()


def get_db():
    """Dependency to get database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def test_database_connection():
    """Test database connection and return connection info."""
    try:
        with engine.connect() as connection:
            # Get database info
            if "sqlite" in settings.database_url:
                result = connection.execute("SELECT sqlite_version()")
                version = result.fetchone()[0]
                return {"type": "SQLite", "version": version, "status": "connected"}
            elif "postgresql" in settings.database_url:
                result = connection.execute("SELECT version()")
                version = result.fetchone()[0]
                return {"type": "PostgreSQL", "version": version, "status": "connected"}
            else:
                return {"type": "Unknown", "version": "N/A", "status": "connected"}
    except Exception as e:
        return {"type": "Unknown", "version": "N/A", "status": f"error: {str(e)}"}
