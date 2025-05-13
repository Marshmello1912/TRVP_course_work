from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from db.session import SessionLocal
from models.favorite import Favorite
from models.recipe import Recipe
from routers.auth import get_current_user
from schemas.recipe import RecipeOut

router = APIRouter(tags=["favorites"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post(
    "/recipes/{recipe_id}/favorite",
    status_code=status.HTTP_201_CREATED,
    summary="Добавить рецепт в избранное",
)
def add_favorite(
    recipe_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    # Проверяем, что рецепт существует
    recipe = db.query(Recipe).get(recipe_id)
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Рецепт не найден",
        )
    # Проверяем, что ещё не добавлен в избранное
    exists = (
        db.query(Favorite)
        .filter_by(user_id=current_user.id, recipe_id=recipe_id)
        .first()
    )
    if exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Рецепт уже в избранном",
        )
    fav = Favorite(user_id=current_user.id, recipe_id=recipe_id)
    db.add(fav)
    db.commit()
    return {"recipe_id": recipe_id, "created_at": fav.created_at}


@router.delete(
    "/recipes/{recipe_id}/favorite",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Убрать рецепт из избранного",
)
def remove_favorite(
    recipe_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    fav = (
        db.query(Favorite)
        .filter_by(user_id=current_user.id, recipe_id=recipe_id)
        .first()
    )
    if not fav:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Рецепт не найден в избранном",
        )
    db.delete(fav)
    db.commit()
    return


@router.get(
    "/favorites",
    response_model=list[RecipeOut],
    summary="Список избранных рецептов текущего пользователя",
)
def list_favorites(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    recipes = (
        db.query(Recipe)
        .join(Favorite, Favorite.recipe_id == Recipe.id)
        .filter(Favorite.user_id == current_user.id)
        .all()
    )
    return recipes
