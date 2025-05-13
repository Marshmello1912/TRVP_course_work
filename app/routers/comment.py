from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.session import SessionLocal
from crud.comment import add_comment
from schemas.comment import CommentOut, CommentCreate
from routers.auth import get_current_user
from models.user import User

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/recipes/{recipe_id}/comments", response_model=CommentOut)
def comment_recipe(
    recipe_id: int,
    comment: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return add_comment(db, recipe_id, current_user.id, comment.content)