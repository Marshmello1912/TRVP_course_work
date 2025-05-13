from sqlalchemy.orm import Session
from models.media import Media

def create_media(db: Session, recipe_id: int, url: str, media_type: str):
    db_media = Media(recipe_id=recipe_id, url=url, media_type=media_type)
    db.add(db_media)
    db.commit()
    db.refresh(db_media)
    return db_media