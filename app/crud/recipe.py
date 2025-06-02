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


from sqlalchemy import func

def get_recipes(db: Session, skip=0, limit=10, sort="rating", query=None):
    q = db.query(Recipe)

    if query:
        q = q.filter(Recipe.title.ilike(f"%{query}%"))

    if sort == "rating":
        q = q.order_by(Recipe.rating.desc())
    elif sort == "date":
        q = q.order_by(Recipe.created_at.desc())

    return q.offset(skip).limit(limit).all()


def get_recipes_by_author(db: Session, author_id: int):
    return db.query(Recipe).filter(Recipe.author_id == author_id).all()

def update_recipe(db: Session, recipe: Recipe, update_data: dict):
    for field, value in update_data.items():
        if value is not None:
            setattr(recipe, field, value)
    db.commit()
    db.refresh(recipe)
    return recipe
