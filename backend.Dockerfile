# backend.Dockerfile
FROM python:3.12-slim

# Установка зависимостей
WORKDIR /app
COPY app /app
RUN pip install -r requirements.txt

# Порт и запуск
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
