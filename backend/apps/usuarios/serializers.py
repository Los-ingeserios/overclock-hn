from typing import Any

from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate

# Se toma el usuario actual con el metodo get_user_model()
# Esto permite evitar errores si a futuro se usa otro modelo de usuario
CustomUsuario = get_user_model()

class RegistroSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        user = CustomUsuario.objects.create(**validated_data)
        user.set_password(validated_data["password"])
        user.save()

        return user
        
    class Meta:
        model = CustomUsuario
        fields = ["id", "username", "password"]

        # Esta linea especifica que el usuario no pueda ver la contrasena despues de crearla
        extra_kwargs = {"password": {"write_only": True}} 

class UsuarioAllSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        user = CustomUsuario.objects.create(**validated_data)
        user.set_password(validated_data["password"])
        user.save()

        return user

    # Actualiza todos los campos
    def update(self, instance, validated_data):
        instance.username = validated_data.get("username", instance.username)
        instance.url_img = validated_data.get("url_img", instance.url_img)
        instance.is_admin = validated_data.get("is_admin", instance.is_admin)
        instance.rol_admin = validated_data.get("rol_admin", instance.rol_admin)
        instance.is_active = validated_data.get("is_active", instance.is_active)

        if 'password' in validated_data:
            # Llamada al metodo de usuario, debido a que se trata de una instancia de este
            instance.set_password(validated_data["password"])

        instance.save()
        return instance

    class Meta:
        model = CustomUsuario
        fields = ["id", "username", "password", "date_joined", "url_img", 
                  "is_admin", "rol_admin", "is_active"]
        extra_kwargs = {"password": {"write_only": True},
                        "date_joined": {"read_only": True}}

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    # Se suprime la advertencia debido a una validacion de pyright, pero el tipo de retorno del metodo es valido
    def validate(self, data): # pyright: ignore[reportIncompatibleMethodOverride]
        user = authenticate(**data)
        if user and user.is_active:
            return user

        raise serializers.ValidationError("Las credenciales del usuario no son correctas")
