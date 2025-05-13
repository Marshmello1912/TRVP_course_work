from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, JSON, func, select
from sqlalchemy.orm import relationship
from sqlalchemy.ext.hybrid import hybrid_property
from datetime import datetime
from db.base import Base
from models.rating import Rating

class Recipe(Base):
    __tablename__ = 'recipes'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(String, nullable=False)
    ingredients = Column(JSON, nullable=False)
    steps = Column(JSON, nullable=False)
    author_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    author = relationship('User', back_populates='recipes')
    media = relationship('Media', back_populates='recipe', cascade='all, delete-orphan')
    ratings = relationship("Rating", back_populates="recipe")
    favorited_by = relationship(
        "Favorite",
        back_populates="recipe",
        cascade="all, delete-orphan",
    )

    @hybrid_property
    def rating(self) -> int:
        # сумма всех голосов (+1 или -1)
        return sum(r.score for r in self.ratings) if self.ratings else 0

    @rating.expression
    def rating(cls):
        # SQL-выражение для list/queries
        return (
            select(func.coalesce(func.sum(Rating.score), 0))
            .where(Rating.recipe_id == cls.id)
            .label("rating")
        )
    comments = relationship('Comment', back_populates='recipe', cascade='all, delete-orphan')