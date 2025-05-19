from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from db.session import SessionLocal
from models.comment import Comment
from models.rating import Rating
from schemas.recipe import RecipeCreate, RecipeOut
from crud.recipe import create_recipe, get_recipe, get_recipes, get_recipes_by_author
from routers.auth import get_current_user
from models.user import User
from models.recipe import Recipe
from schemas.recipe import RecipeUpdate
from crud.recipe import update_recipe
router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post('/recipes/', response_model=RecipeOut)
def post_recipe(
    recipe: RecipeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_recipe(db, recipe, current_user.id)

@router.get('/recipes/', response_model=List[RecipeOut])
def read_recipes(
    skip: int = 0,
    limit: int = 10,
    sort: str = Query('rating', regex='^(rating|date)$'),
    query: Optional[str] = None,
    db: Session = Depends(get_db)
):
    return get_recipes(db, skip, limit, sort, query)

@router.get('/recipes/{recipe_id}', response_model=RecipeOut)
def read_recipe(recipe_id: int, db: Session = Depends(get_db)):
    db_recipe = get_recipe(db, recipe_id)
    if not db_recipe:
        raise HTTPException(status_code=404, detail='Recipe not found')
    return db_recipe


@router.delete("/recipes/{recipe_id}",  status_code=204,
    summary="Удалить рецепт (только автор)",)
def delete_recipe(
    recipe_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    # 1) Проверим, что рецепт существует
    recipe = db.query(Recipe).get(recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Рецепт не найден")

    # 2) Только автор может удалить
    if recipe.author_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="У вас нет прав на удаление этого рецепта"
        )

    db.query(Rating).filter(Rating.recipe_id == recipe_id).delete()
    # И все комментарии, если они тоже имеют FK NOT NULL
    db.query(Comment).filter(Comment.recipe_id == recipe_id).delete()

    # 3) Удаляем
    db.delete(recipe)
    db.commit()
    return  # 204 No Content

@router.get('/users/{user_id}/recipes', response_model=List[RecipeOut])
def read_user_recipes(user_id: int, db: Session = Depends(get_db)):
    return get_recipes_by_author(db, user_id)



@router.put("/recipes/{recipe_id}", response_model=RecipeOut)
def update_recipe_route(
    recipe_id: int,
    recipe_in: RecipeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    recipe = db.query(Recipe).get(recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Рецепт не найден")
    if recipe.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Нет прав на редактирование")
    return update_recipe(db, recipe, recipe_in.dict(exclude_unset=True))
