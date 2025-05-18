from channels.middleware import BaseMiddleware
from rest_framework.authentication import TokenAuthentication

from asgiref.sync import sync_to_async


@sync_to_async
def get_user_from_token_header(auth_header):
    try:
        if auth_header and auth_header.startswith("Token "):
            token_key = auth_header.split("Token ")[1]
            auth = TokenAuthentication()
            user, _ = auth.authenticate_credentials(token_key)
            return user
    except Exception as exception:
        pass
    from django.contrib.auth.models import AnonymousUser

    return AnonymousUser()


class HeaderTokenAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        headers = dict(scope.get("headers", []))
        raw_auth = headers.get(b"authorization", b"").decode()
        scope["user"] = await get_user_from_token_header(raw_auth)
        return await super().__call__(scope, receive, send)


def HeaderTokenAuthMiddlewareStack(inner):
    return HeaderTokenAuthMiddleware(inner)
