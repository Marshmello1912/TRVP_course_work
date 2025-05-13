from pydantic import BaseModel
from datetime import datetime

class RatingCreate(BaseModel):
    score: int

class RatingOut(BaseModel):
    id: int
    user_id: int
    score: int
    created_at: datetime

    class Config:
        orm_mode = True