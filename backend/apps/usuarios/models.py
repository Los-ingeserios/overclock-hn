from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils.translation import gettext_lazy as _

class CustomUsuarioManager(BaseUserManager):
    def create_user(self, username, password, **extra_fields):
        if not username:
            raise ValueError(_("Debe proveer un nombre de usuario"))

        # Recibe el nombre de usuario como atributo requerido, debido a que se usara como forma de autenticacion
        user = self.model(username=username)

        # Se sobreescribe el metodo set_password para hashear correctamente la contrasena
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, username, password, **extra_fields):
        user = self.create_user(username=username, 
                                password=password,
                                extra_fields=extra_fields)

        user.is_admin = True
        user.save(using=self._db)

        return user

class Usuario(AbstractBaseUser):
    # Valores para el choice de los roles
    EMPLEADO = "EMPL"
    GERENTE = "GEN"
    SUPERVISOR = "SUP"

    ROLES_ADMIN_CHOICES = [
        (EMPLEADO, "Empleado"),
        (GERENTE, "Gerente"),
        (SUPERVISOR, "Supervisor")
    ]

    username = models.CharField(unique=True, max_length=20)
    date_joined = models.DateTimeField(auto_now_add=True)
    url_img = models.CharField(max_length=500, blank=True, null=True)
    is_admin = models.BooleanField(default=False)
    rol_admin = models.CharField(max_length=20, choices=ROLES_ADMIN_CHOICES, blank=True, null=True)
    is_active = models.BooleanField(default=True)

    objects = CustomUsuarioManager()

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.username

    def has_perm(self, perm, obj=None):
        return True

    @property
    def is_staff(self):
        return self.is_admin