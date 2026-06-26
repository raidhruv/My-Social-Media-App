import hashlib
import secrets


def generate_verification_token() -> str:
    return secrets.token_urlsafe(32)


def hash_verification_token(
    token: str,
) -> str:
    return hashlib.sha256(
        token.encode()
    ).hexdigest()


def verify_verification_token(
    token: str,
    token_hash: str,
) -> bool:
    return (
        hash_verification_token(token)
        == token_hash
    )