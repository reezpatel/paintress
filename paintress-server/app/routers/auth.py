"""Authentication router for login, registration, and token management."""

from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas import (
    UserCreate,
    UserLogin,
    GoogleLogin,
    ClerkLogin,
    Token,
    MessageResponse,
    UserResponse,
)
from ..auth import (
    authenticate_user,
    create_access_token,
    create_refresh_token,
    verify_token,
    create_user,
    get_user_by_email,
    get_user_by_google_id,
    get_user_by_clerk_id,
)
from ..google_auth import (
    verify_google_token,
    create_or_update_google_user,
    GoogleAuthError,
)
from ..clerk_auth import (
    verify_clerk_token,
    create_or_update_clerk_user,
    ClerkAuthError,
)
from ..dependencies import security
from ..config import settings

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post(
    "/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED
)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user with email and password."""
    # Check if user already exists
    db_user = get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )

    # Create user data
    user_data = {
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "password": user.password,
        "is_active": True,
    }

    # Create new user
    new_user = create_user(db, user_data)
    return new_user


@router.post("/login", response_model=Token)
async def login_user(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """Login user with email and password."""
    user = authenticate_user(db, user_credentials.email, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user"
        )

    # Create tokens
    access_token = create_access_token(
        data={"sub": user.email, "name": f"{user.first_name} {user.last_name}"}
    )
    refresh_token = create_refresh_token(
        data={"sub": user.email, "name": f"{user.first_name} {user.last_name}"}
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


@router.post("/google-login", response_model=Token)
async def google_login(google_data: GoogleLogin, db: Session = Depends(get_db)):
    """Login or register user with Google OAuth token."""
    try:
        # Verify Google token
        user_info = verify_google_token(google_data.google_token)
        if not user_info:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Google token"
            )

        # Check if user exists by Google ID
        user = get_user_by_google_id(db, user_info["google_id"])

        if not user:
            # Check if user exists by email
            user = get_user_by_email(db, user_info["email"])
            if user and not user.google_id:
                # Link existing account with Google
                user.google_id = user_info["google_id"]
                db.commit()
                db.refresh(user)
            else:
                # Create new user
                user_data = create_or_update_google_user(user_info)
                user = create_user(db, user_data)

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user"
            )

        # Create tokens
        access_token = create_access_token(data={"sub": user.email})
        refresh_token = create_refresh_token(data={"sub": user.email})

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
        }

    except GoogleAuthError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))


@router.post("/refresh-token", response_model=Token)
async def refresh_access_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    """Refresh access token using refresh token."""
    token_data = verify_token(credentials.credentials, token_type="refresh")
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = get_user_by_email(db, email=token_data.email)
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
        )

    # Create new tokens
    access_token = create_access_token(data={"sub": user.email})
    refresh_token = create_refresh_token(data={"sub": user.email})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


@router.post("/clerk-login", response_model=Token)
async def clerk_login(clerk_data: ClerkLogin, db: Session = Depends(get_db)):
    """Login or register user with Clerk session token."""
    try:
        # Verify Clerk token
        user_info = verify_clerk_token(clerk_data.clerk_token)
        if not user_info:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Clerk token"
            )

        # Check if user exists by Clerk ID
        user = get_user_by_clerk_id(db, user_info["clerk_id"])

        if not user:
            # Check if user exists by email
            user = get_user_by_email(db, user_info["email"])
            if user and not user.clerk_id:
                # Link existing account with Clerk
                user.clerk_id = user_info["clerk_id"]
                db.commit()
                db.refresh(user)
            else:
                # Create new user
                user_data = create_or_update_clerk_user(user_info)
                user = create_user(db, user_data)

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user"
            )

        # Create tokens
        access_token = create_access_token(data={"sub": user.email})
        refresh_token = create_refresh_token(data={"sub": user.email})

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
        }

    except ClerkAuthError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))


@router.post("/logout", response_model=MessageResponse)
async def logout_user():
    """Logout user (client should discard tokens)."""
    return {"message": "Successfully logged out"}
