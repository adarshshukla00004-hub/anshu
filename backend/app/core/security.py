import hashlib
import hmac
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import HTTPException, Security, status
from fastapi.security import APIKeyHeader
from app.core.config import settings

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)


def hash_token(token: str) -> str:
    """Create a SHA-256 hash of a raw token."""
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def generate_random_token(length: int = 32) -> str:
    """Generate a secure cryptographic random URL-safe token."""
    return secrets.token_urlsafe(length)


def verify_static_token(provided_token: str, expected_token: str) -> bool:
    """Constant-time token comparison to avoid timing attacks."""
    return hmac.compare_digest(provided_token, expected_token)


async def get_optional_api_key(
    api_key: Optional[str] = Security(api_key_header),
) -> Optional[str]:
    """Optional API key extraction dependency."""
    return api_key
