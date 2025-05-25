@echo off
echo Зупиняю docker compose...
docker compose -f docker/docker-compose.yml -f docker/docker-compose.queues.yml down
pause
