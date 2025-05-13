from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:123@localhost:5432/culinary_db"
    SECRET_KEY: str = "your-secret-key"

settings = Settings()
