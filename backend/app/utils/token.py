import hashlib
import secrets


def generate_secure_token() -> str:
    return secrets.token_urlsafe(32)


def hash_secure_token(
    token: str,
) -> str:
    return hashlib.sha256(
        token.encode()
    ).hexdigest()


def verify_secure_token(
    token: str,
    token_hash: str,
) -> bool:
    return (
        hash_secure_token(token)
        == token_hash
    )