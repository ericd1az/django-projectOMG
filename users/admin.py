from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User


@admin.register(User)
class TiendaUserAdmin(UserAdmin):
    list_display = ('id', 'email', 'username', 'telefono', 'is_staff')
    search_fields = ('email', 'username', 'telefono')
    ordering = ('email',)
    fieldsets = UserAdmin.fieldsets + (
        ('Datos de la tienda', {'fields': ('telefono',)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Datos de la tienda', {'fields': ('email', 'telefono')}),
    )
