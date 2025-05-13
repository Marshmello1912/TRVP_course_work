from passlib.context import CryptContext
from itsdangerous import URLSafeSerializer
from db.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
serializer = URLSafeSerializer(settings.SECRET_KEY, salt="session")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_session_token(user_id: int) -> str:
    return serializer.dumps({"user_id": user_id})

def decode_session_token(token: str) -> int | None:
    try:
        data = serializer.loads(token)
        return data.get("user_id")
    except Exception:
        return None

