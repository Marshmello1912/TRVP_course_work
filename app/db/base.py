
from sqlalchemy.orm import declarative_base
from db.session import engine

# Сначала объявляем Base
Base = declarative_base()

def init_db():
    # ленивые (внутренние) импорты — чтобы модели могли безопасно импортировать Base
    import models.user
    import models.recipe
    Base.metadata.create_all(bind=engine)
