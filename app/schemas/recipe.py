from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from schemas.media import MediaOut
from schemas.comment import CommentOut
class RecipeBase(BaseModel):
    title: str
    description: str
    ingredients: List[str]
    steps: List[str]

class RecipeCreate(RecipeBase):
    pass

class RecipeOut(RecipeBase):
    id: int
    author_id: int
    created_at: datetime
    updated_at: datetime
    rating: int = 0.0
    media: List[MediaOut] = []
    comments: List[CommentOut] = []

    class Config:
        orm_mode = True

class RecipeUpdate(BaseModel):
    title: Optional[str]
    description: Optional[str]
    ingredients: Optional[List[str]]
    steps: Optional[List[str]]
