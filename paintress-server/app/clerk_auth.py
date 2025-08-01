"""Clerk authentication integration for user authentication."""

from typing import Optional, Dict, Any
from clerk_backend_api import Clerk
from clerk_backend_api.models import ClerkErrors
from .config import settings


class ClerkAuthError(Exception):
    """Custom exception for Clerk authentication errors."""

    pass


def get_clerk_client() -> Clerk:
    """Get configured Clerk client."""
    if not settings.clerk_secret_key:
        raise ClerkAuthError("Clerk secret key not configured")

    return Clerk(bearer_auth=settings.clerk_secret_key)


def verify_clerk_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Verify Clerk session token and return user info.

    Args:
        token: Clerk session token from client

    Returns:
        Dict containing user info if valid, None if invalid

    Raises:
        ClerkAuthError: If token verification fails
    """
    try:
        clerk = get_clerk_client()

        # Verify the session token
        session = clerk.sessions.verify_session(session_id=token, token=token)

        if not session or not session.user_id:
            raise ClerkAuthError("Invalid session token")

        # Get user information
        user = clerk.users.get_user(user_id=session.user_id)

        if not user:
            raise ClerkAuthError("User not found")

        # Extract primary email address
        primary_email = None
        if user.email_addresses:
            for email in user.email_addresses:
                if hasattr(email, "id") and email.id == user.primary_email_address_id:
                    primary_email = email.email_address
                    break

            # Fallback to first email if primary not found
            if not primary_email and user.email_addresses:
                primary_email = user.email_addresses[0].email_address

        if not primary_email:
            raise ClerkAuthError("No email address found for user")

        # Extract user information
        user_info = {
            "clerk_id": user.id,
            "email": primary_email,
            "first_name": user.first_name or "",
            "last_name": user.last_name or "",
            "email_verified": True,  # Clerk handles email verification
        }

        return user_info

    except ClerkErrors as e:
        # Clerk API errors
        raise ClerkAuthError(f"Clerk API error: {str(e)}")
    except Exception as e:
        # Other errors
        raise ClerkAuthError(f"Token verification failed: {str(e)}")


def create_or_update_clerk_user(user_info: Dict[str, Any]) -> Dict[str, Any]:
    """
    Create user data dict for Clerk user.

    Args:
        user_info: User information from Clerk

    Returns:
        Dict containing user data for database creation
    """
    return {
        "email": user_info["email"],
        "clerk_id": user_info["clerk_id"],
        "first_name": user_info["first_name"],
        "last_name": user_info["last_name"],
        "is_active": True,
        "password": None,  # No password for Clerk users
    }


def get_user_by_clerk_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Get user information by Clerk token.

    Args:
        token: Clerk session token

    Returns:
        User info dict if valid, None if invalid
    """
    try:
        return verify_clerk_token(token)
    except ClerkAuthError:
        return None
