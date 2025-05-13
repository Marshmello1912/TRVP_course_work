from pydantic import BaseModel
from datetime import datetime

class FavoriteOut(BaseModel):
    recipe_id: int
    created_at: datetime

    class Config:
        orm_mode = True
