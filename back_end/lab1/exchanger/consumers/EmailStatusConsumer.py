import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django_redis import get_redis_connection


class EmailStatusConsumer(AsyncWebsocketConsumer):
    group_name = "email_status_channel"

    async def connect(self):
        user = self.scope["user"]
        if user.is_superuser:
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()
            await self.send_all_statuses()
        else:
            await self.close()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def email_status_update(self, event):
        await self.send(text_data=json.dumps(event["payload"]))

    async def send_all_statuses(self):
        redis = get_redis_connection("default")
        task_ids = redis.smembers("email_task_ids")
        statuses = []

        for task_id in task_ids:
            task_key = f"email_task_status:{task_id.decode()}"
            data = redis.get(task_key)
            if data:
                try:
                    statuses.append(json.loads(data))
                except Exception:
                    print(f"task {task_id.decode()} is died")

        await self.send(text_data=json.dumps({
            "type": "initial_statuses",
            "tasks": statuses
        }))