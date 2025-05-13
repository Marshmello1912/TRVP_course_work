from sqlalchemy.orm import Session
from models.rating import Rating


def add_rating(db: Session, recipe_id: int, user_id: int, score: int):
    # предотвратить дублирование
    existing = db.query(Rating).filter(
        Rating.recipe_id == recipe_id,
        Rating.user_id == user_id
    ).first()
    if existing:
        existing.score = score
        db.commit()
        return existing
    db_rating = Rating(recipe_id=recipe_id, user_id=user_id, score=score)
    db.add(db_rating)
    db.commit()
    db.refresh(db_rating)
    return db_rating