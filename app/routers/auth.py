from fastapi import APIRouter, Depends, HTTPException, status, Response, Request, Cookie
from sqlalchemy.orm import Session
from schemas.user import UserLogin, UserOut, UserCreate
from crud.user import get_user_by_username, create_user
from utils.security import verify_password, create_session_token, decode_session_token
from db.session import SessionLocal
from models.user import User

router = APIRouter()

SESSION_COOKIE_NAME = "session"

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(
        db: Session = Depends(get_db),
        session_token: str = Cookie(default=None, alias=SESSION_COOKIE_NAME)
) -> User:
    if session_token is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user_id = decode_session_token(session_token)
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid session")
    user = db.query(User).get(user_id)
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@router.post("/register", response_model=UserOut)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing = get_user_by_username(db, user.username)
    if existing:
        raise HTTPException(status_code=400, detail="Username already registered")
    return create_user(db, user)


@router.post("/login", response_model=UserOut)
def login(user_data: UserLogin, response: Response, db: Session = Depends(get_db)):
    user = get_user_by_username(db, user_data.username)
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_session_token(user.id)
    response.set_cookie(key=SESSION_COOKIE_NAME, value=token, httponly=True)
    return user


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(SESSION_COOKIE_NAME)
    return {"message": "Logged out"}

@router.get("/me", response_model=UserOut)
def read_current_user(
    current_user: User = Depends(get_current_user)
):
    return current_user


