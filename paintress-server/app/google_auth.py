"""Google OAuth integration for user authentication."""

import json
from typing import Optional, Dict, Any
from google.auth.transport import requests
from google.oauth2 import id_token
from .config import settings


class GoogleAuthError(Exception):
    """Custom exception for Google authentication errors."""

    pass


def verify_google_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Verify Google OAuth token and return user info.

    Args:
        token: Google OAuth token from client

    Returns:
        Dict containing user info if valid, None if invalid

    Raises:
        GoogleAuthError: If token verification fails
    """
    try:
        # Verify the token with Google
        idinfo = id_token.verify_oauth2_token(
            token, requests.Request(), settings.google_client_id
        )

        # Check if token is for our application
        if idinfo["aud"] != settings.google_client_id:
            raise GoogleAuthError("Invalid audience")

        # Extract user information
        user_info = {
            "google_id": idinfo["sub"],
            "email": idinfo["email"],
            "first_name": idinfo.get("given_name", ""),
            "last_name": idinfo.get("family_name", ""),
            "email_verified": idinfo.get("email_verified", False),
        }

        return user_info

    except ValueError as e:
        # Invalid token
        raise GoogleAuthError(f"Invalid token: {str(e)}")
    except Exception as e:
        # Other errors
        raise GoogleAuthError(f"Token verification failed: {str(e)}")


def create_or_update_google_user(user_info: Dict[str, Any]) -> Dict[str, Any]:
    """
    Create user data dict for Google OAuth user.

    Args:
        user_info: User information from Google

    Returns:
        Dict containing user data for database creation
    """
    return {
        "email": user_info["email"],
        "google_id": user_info["google_id"],
        "first_name": user_info["first_name"],
        "last_name": user_info["last_name"],
        "is_active": True,
        "password": None,  # No password for Google OAuth users
    }
