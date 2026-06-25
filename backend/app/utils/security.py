import secrets

from pwdlib import PasswordHash

password_hash = PasswordHash.recommended()


def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    return password_hash.verify(
        plain_password,
        hashed_password,
    )


def hash_refresh_token(token: str) -> str:
    return password_hash.hash(token)


def verify_refresh_token(
    token: str,
    token_hash: str,
) -> bool:
    return password_hash.verify(
        token,
        token_hash,
    )


def generate_secure_token(
    length: int = 32,
) -> str:
    return secrets.token_urlsafe(length)