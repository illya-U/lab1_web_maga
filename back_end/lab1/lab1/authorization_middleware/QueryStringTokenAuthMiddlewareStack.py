from urllib.parse import parse_qs
from channels.middleware import BaseMiddleware
from asgiref.sync import sync_to_async


@sync_to_async
def get_user_from_token(token_key):
    from rest_framework.authentication import TokenAuthentication
    from django.contrib.auth.models import AnonymousUser

    try:
        auth = TokenAuthentication()
        user, _ = auth.authenticate_credentials(token_key)
        return user
    except Exception:
        return AnonymousUser()


class QueryStringTokenAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        from django.contrib.auth.models import AnonymousUser

        query_string = scope.get("query_string", b"").decode()
        query_params = parse_qs(query_string)
        token = query_params.get("token", [None])[0]

        scope["user"] = await get_user_from_token(token) if token else AnonymousUser()
        return await super().__call__(scope, receive, send)


def QueryStringTokenAuthMiddlewareStack(inner):
    return QueryStringTokenAuthMiddleware(inner)
