from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Query, Form
from sqlalchemy.orm import Session
from db.session import SessionLocal
from crud.media import create_media
from routers.auth import get_current_user
from models.user import User
import os

router = APIRouter()

UPLOAD_DIR = 'uploads'

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/recipes/{recipe_id}/media", response_model=dict)
async def upload_media(
    recipe_id: int,
    media_file: UploadFile = File(...),
    media_type: str      = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # создаём директорию для медиа этого рецепта
    recipe_dir = os.path.join(UPLOAD_DIR, str(recipe_id))
    os.makedirs(recipe_dir, exist_ok=True)
    # сохраняем файл внутри неё
    file_name = "image" if media_type == "image" else "media"
    file_extension = os.path.splitext(media_file.filename)[1]
    file_path = os.path.join(recipe_dir, f"{file_name}{file_extension}")
    with open(file_path, 'wb') as f:
        f.write(await media_file.read())
    url = f"/{file_path}"
    media = create_media(db, recipe_id, url, media_type)
    return {"id": media.id, "url": media.url, "media_type": media.media_type}