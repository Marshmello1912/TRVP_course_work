from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./culinary_db.db"
    SECRET_KEY: str = "your-secret-key"

settings = Settings()
