# Базовый образ
FROM python:3.11-slim

# Переменные окружения
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PORT 8000

# Обновить apt и поставить зависимости
RUN apt-get update && apt-get install -y gcc libpq-dev

# Установить рабочую директорию
WORKDIR /app

# Скопировать весь проект
COPY . .

# Установить зависимости
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt


CMD ["sh", "-c", "python manage.py makemigrations --noinput && python manage.py migrate --noinput && gunicorn lab1.wsgi:application --bind 0.0.0.0:${PORT}"]