from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from db.base import Base

class Media(Base):
    __tablename__ = 'media'

    id = Column(Integer, primary_key=True, index=True)
    recipe_id = Column(Integer, ForeignKey('recipes.id', ondelete='CASCADE'), nullable=False)
    url = Column(String, nullable=False)
    media_type = Column(String, nullable=False)  # 'image' or 'video'
    created_at = Column(DateTime, default=datetime.utcnow)

    recipe = relationship('Recipe', back_populates='media')