"""
ASGI config for lab1 project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os

import django
from channels.routing import URLRouter, ProtocolTypeRouter
from django.core.asgi import get_asgi_application

from exchanger.routing import websocket_urlpatterns
from lab1.authorization_middleware.HeaderTokenAuthMiddlewareStack import HeaderTokenAuthMiddlewareStack

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "lab1.settings")
django.setup()
django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": HeaderTokenAuthMiddlewareStack(URLRouter(websocket_urlpatterns)),
    }
)
