from sqlalchemy.orm import Session
from sqlalchemy import func
from models.recipe import Recipe
from schemas.recipe import RecipeCreate


def create_recipe(db: Session, recipe: RecipeCreate, author_id: int):
    db_recipe = Recipe(
        title=recipe.title,
        description=recipe.description,
        ingredients=recipe.ingredients,
        steps=recipe.steps,
        author_id=author_id
    )
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    return db_recipe


def get_recipe(db: Session, recipe_id: int):
    return db.query(Recipe).filter(Recipe.id == recipe_id).first()


def get_recipes(
    db: Session,
    skip: int = 0,
    limit: int = 10,
    sort: str = 'rating',
    query: str = None
):
    q = db.query(Recipe)
    if query:
        q = q.filter(Recipe.title.ilike(f"%{query}%"))
    if sort == 'rating':
        # join ratings and calculate avg
        q = q.outerjoin(Recipe.ratings).group_by(Recipe.id)
        q = q.order_by(func.coalesce(func.avg(Recipe.ratings.property.mapper.class_.score), 0).desc())
    else:
        q = q.order_by(Recipe.created_at.desc())
    return q.offset(skip).limit(limit).all()


def get_recipes_by_author(db: Session, author_id: int):
    return db.query(Recipe).filter(Recipe.author_id == author_id).all()