from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from db.session import SessionLocal
from models.rating import Rating
from models.comment import Comment
from models.recipe import Recipe
from routers.auth import get_current_user  # импорт зависимости

router = APIRouter(
    prefix="/recipes/{recipe_id}/stats",
    tags=["stats"],
)

# локальный get_db
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=dict)
def get_recipe_stats(
    recipe_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),  # здесь получаем залогиненного
):
    # 1) Проверим, что рецепт существует
    recipe = db.query(Recipe).get(recipe_id)
    if not recipe:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Recipe not found")

    # 2) Разрешим доступ только автору
    if recipe.author_id != current_user.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Forbidden")

    # 3) Собираем статистику
    likes = (
        db.query(
            func.date(Rating.created_at).label("date"),
            func.sum(Rating.score).label("value"),
        )
        .filter(Rating.recipe_id == recipe_id)
        .group_by(func.date(Rating.created_at))
        .order_by(func.date(Rating.created_at))
        .all()
    )
    comments = (
        db.query(
            func.date(Comment.created_at).label("date"),
            func.count().label("value"),
        )
        .filter(Comment.recipe_id == recipe_id)
        .group_by(func.date(Comment.created_at))
        .order_by(func.date(Comment.created_at))
        .all()
    )

    return {
        "likes": [{"date": d if isinstance(d, str) else d.isoformat(), "value": int(v)} for d, v in likes],
        "comments": [{"date": d if isinstance(d, str) else d.isoformat(), "value": int(v)} for d, v in comments],
    }
