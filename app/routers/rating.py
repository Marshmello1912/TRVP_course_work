from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.session import SessionLocal
from crud.rating import add_rating
from schemas.rating import RatingOut, RatingCreate
from routers.auth import get_current_user
from models.user import User

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/recipes/{recipe_id}/rate", response_model=RatingOut)
def rate_recipe(
    recipe_id: int,
    rating: RatingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if rating.score not in (-1, 1):
        raise HTTPException(status_code=400, detail='Score must be -1 or 1')
    return add_rating(db, recipe_id, current_user.id, rating.score)