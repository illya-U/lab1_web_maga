from django.urls import re_path

from exchanger.consumers.EmailStatusConsumer import EmailStatusConsumer
from exchanger.consumers.GetTransactions import TransactionsConsumer
from exchanger.consumers.OnlineUser import OnlineUserConsumer

websocket_urlpatterns = [
    re_path(r"ws/online/$", OnlineUserConsumer.as_asgi()),
    re_path(r"ws/transactions/$", TransactionsConsumer.as_asgi()),
    re_path(r"ws/email-status/$", EmailStatusConsumer.as_asgi())
]
