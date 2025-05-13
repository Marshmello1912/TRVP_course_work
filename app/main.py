from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from routers import auth, recipe, media, rating,comment, favorite
from db.base import init_db
from routers.stats import router as stats_router


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5433"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads",
)
init_db()  # создаёт таблицы
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(recipe.router)
app.include_router(media.router, tags=["media"])
app.include_router(rating.router, tags=["rating"])
app.include_router(comment.router, tags=["comment"])
app.include_router(favorite.router, tags=["favorite"])
app.include_router(stats_router)