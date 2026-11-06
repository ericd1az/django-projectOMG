from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name',
            'telefono', 'is_active', 'is_staff', 'password',
        )
        read_only_fields = ('id',)

    def validate(self, attrs):
        if self.instance is None and not attrs.get('password'):
            raise serializers.ValidationError({'password': 'Este campo es obligatorio.'})
        if 'password' in attrs:
            user = self.instance or User(**{
                field: attrs.get(field, '') for field in ('username', 'email', 'first_name', 'last_name')
            })
            try:
                validate_password(attrs['password'], user=user)
            except DjangoValidationError as error:
                raise serializers.ValidationError({'password': error.messages}) from error
        return attrs

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for field, value in validated_data.items():
            setattr(instance, field, value)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance
