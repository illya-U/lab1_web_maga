from channels.generic.websocket import AsyncWebsocketConsumer
from django.core.cache import cache
import json


class OnlineUserConsumer(AsyncWebsocketConsumer):
    group_name = "online_users_group"

    async def connect(self):
        user = self.scope["user"]
        if user.is_superuser:
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()
            await self.send_online_users()
        else:
            await self.close()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        await self.send_online_users()

    async def send_online_users(self):
        users = list(cache.get("online_users", set()))
        await self.send(text_data=json.dumps({"online_users": users}))

    async def online_users_changed(self, event):
        await self.send_online_users()
