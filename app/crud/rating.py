from sqlalchemy.orm import Session
from models.rating import Rating


def add_rating(db: Session, recipe_id: int, user_id: int, score: int) -> Rating:
    existing = db.query(Rating).filter_by(recipe_id=recipe_id, user_id=user_id).first()
    if existing:
        if existing.score == score:
            db.delete(existing)
            db.commit()
            return Rating(id=existing.id, recipe_id=recipe_id, user_id=user_id, score=0)  # сигнал удаления
        else:
            existing.score = score
            db.commit()
            db.refresh(existing)
            return existing
    else:
        new_rating = Rating(recipe_id=recipe_id, user_id=user_id, score=score)
        db.add(new_rating)
        db.commit()
        db.refresh(new_rating)
        return new_rating
