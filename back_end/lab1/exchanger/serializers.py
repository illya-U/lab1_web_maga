from rest_framework import serializers
from .models import User, Transaction


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'gender', 'birth_date']

    def create(self, validated_data):
        return self.Meta.model.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['amount', 'from_currency', 'to_currency', 'timestamp']


class TransactionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['amount', 'from_currency', 'to_currency']

    def create(self, validated_data):
        user = self.context['user']
        transaction = Transaction.objects.create(user=user, **validated_data)
        transactions = Transaction.objects.filter(user=user).order_by('-timestamp')
        if transactions.count() > 5:
            transactions.last().delete()
        return transaction


class UserSerializer(serializers.ModelSerializer):
    transactions = TransactionSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'gender', 'birth_date', 'transactions']