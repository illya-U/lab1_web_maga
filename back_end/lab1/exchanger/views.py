from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.core.cache import cache
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token

from .models import User
from .serializers import UserSerializer, TransactionSerializer, TransactionCreateSerializer
from .serializers import RegisterSerializer, LoginSerializer


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return User.objects.all()
        return User.objects.filter(id=self.request.user.id)

    def get_object(self):
        if "pk" in self.kwargs and self.request.user.is_staff:
            return super().get_object()
        return self.request.user

    @action(detail=False, methods=["post"])
    def add_transaction(self, request):
        serializer = TransactionCreateSerializer(data=request.data, context={"user": request.user})
        if serializer.is_valid():
            serializer.save()

            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(f"user_{request.user.id}", {"type": "transactions_update"})

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get"])
    def transactions(self, request):
        transactions = request.user.transactions.all()[:5]
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)


class RegisterView(APIView):
    permission_classes = [AllowAny]
    serializer_class = UserSerializer

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"user": serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]
    serializer_class = UserSerializer

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                email=serializer.validated_data["email"], password=serializer.validated_data["password"]
            )
            if user:
                online_users = cache.get("online_users", set())
                online_users.add(user.username)
                cache.set("online_users", online_users)

                from channels.layers import get_channel_layer
                from asgiref.sync import async_to_sync

                channel_layer = get_channel_layer()
                async_to_sync(channel_layer.group_send)("online_users_group", {"type": "online_users_changed"})

                token, _ = Token.objects.get_or_create(user=user)
                return Response({"token": token.key}, status=status.HTTP_200_OK)
            return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def post(self, request):
        request.user.auth_token.delete()

        online_users = cache.get("online_users", set())
        online_users.discard(request.user.username)
        cache.set("online_users", online_users)

        from channels.layers import get_channel_layer
        from asgiref.sync import async_to_sync

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)("online_users_group", {"type": "online_users_changed"})

        return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
