# frontend.Dockerfile
FROM node:20

# Установка зависимостей и сборка
WORKDIR /app
COPY frontend /app
RUN npm install 
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

