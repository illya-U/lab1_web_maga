@echo off
echo Запускаю docker compose...
docker compose -f docker/docker-compose.yml -f docker/docker-compose.queues.yml up --build
pause
