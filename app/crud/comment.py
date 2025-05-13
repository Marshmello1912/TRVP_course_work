from sqlalchemy.orm import Session
from models.comment import Comment


def add_comment(db: Session, recipe_id: int, user_id: int, content: str):
    db_comment = Comment(recipe_id=recipe_id, user_id=user_id, content=content)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment