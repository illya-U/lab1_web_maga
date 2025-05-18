from channels.generic.websocket import AsyncWebsocketConsumer
import json
from asgiref.sync import sync_to_async


class TransactionsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        if self.user.is_authenticated:
            self.group_name = f"user_{self.user.id}"
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()
            await self.send_transactions()
        else:
            await self.close()

    async def disconnect(self, close_code):
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        await self.send_transactions()

    async def send_transactions(self):
        transactions = await sync_to_async(list)(self.user.transactions.all().order_by("-timestamp")[:5])
        from exchanger.serializers import TransactionSerializer

        serializer = TransactionSerializer(transactions, many=True)
        await self.send(text_data=json.dumps({"transactions": serializer.data}))

    async def transactions_update(self, event):
        await self.send_transactions()
