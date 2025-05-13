from pydantic import BaseModel
from datetime import datetime

class MediaOut(BaseModel):
    id: int
    url: str
    media_type: str
    created_at: datetime

    class Config:
        orm_mode = True