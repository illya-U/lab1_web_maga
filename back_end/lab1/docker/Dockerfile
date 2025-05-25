FROM python:3.11

WORKDIR /code

COPY ../requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY .. .

# Заглушка, бо docker-compose явно задає команду
CMD ["echo", "This container is configured via docker-compose only."]
