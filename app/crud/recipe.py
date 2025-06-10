from sqlalchemy.orm import Session
from sqlalchemy import func
from models.recipe import Recipe
from schemas.recipe import RecipeCreate


def create_recipe(db: Session, recipe_data: RecipeCreate, user_id: int):
    new_recipe = Recipe(
        title=recipe_data.title.lower(),  # сохранить в lowercase
        description=recipe_data.description,
        author_id=user_id,
        ingredients=recipe_data.ingredients,
        steps=recipe_data.steps,
    )
    db.add(new_recipe)
    db.commit()
    db.refresh(new_recipe)
    return new_recipe

def get_recipe(db: Session, recipe_id: int):
    return db.query(Recipe).filter(Recipe.id == recipe_id).first()


from sqlalchemy import func

def get_recipes(db: Session, skip=0, limit=10, sort="rating", query=None):
    q = db.query(Recipe)

    if query:
        q = q.filter(Recipe.title.ilike(f"%{query.lower()}%"))

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
