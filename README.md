# Tienda de Tecnología - API

API de una tienda de tecnología construida con Django REST Framework y MySQL. Incluye categorías, productos, descuentos, usuarios con correo y teléfono, autenticación JWT y documentación Swagger.

## Preparación en Windows (PowerShell)

Desde la carpeta del proyecto:

```powershell
python -m venv venv
.\venv\Scripts\python.exe -m pip install -r requirements.txt
```

Copia `tienda_online/local_settings.example.py` como `tienda_online/local_settings.py` y asigna allí una clave secreta de Django y la contraseña de tu MySQL local. Este archivo está excluido de Git. También puedes usar las variables de entorno `DJANGO_SECRET_KEY` y `MYSQL_PASSWORD`.

La base de datos configurada se llama `django_api`, con usuario `django_user` en `localhost:3306`. En una instalación nueva, crea primero esa base y usuario en MySQL, y después ejecuta:

```powershell
.\venv\Scripts\python.exe manage.py migrate
.\venv\Scripts\python.exe manage.py createsuperuser
.\venv\Scripts\python.exe manage.py runserver
```

Si ya tienes una base antigua creada antes de agregar `users.User`, no borres tablas ni vuelvas a aplicar la migración inicial sobre `auth_user`: esa tabla conserva las cuentas existentes. Haz una copia de seguridad y adapta el historial de migraciones antes de ejecutar `migrate`.

## Rutas principales

| Ruta | Uso |
| --- | --- |
| `/swagger/` | Documentación y pruebas interactivas |
| `/api/v1/auth/token/` | Obtener access y refresh con `email` y `password` |
| `/api/v1/auth/token/refresh/` | Renovar el token de acceso |
| `/api/v1/auth/me/` | Datos de la cuenta autenticada |
| `/api/v1/users/` | CRUD de usuarios, solo administradores |
| `/api/categories/` | Categorías |
| `/api/products/` | Productos, con JWT |

En Swagger, pulsa **Authorize** e introduce solo el token de acceso. Swagger agregará `Bearer` al encabezado. El token de acceso dura 30 minutos. El campo `telefono` se muestra en el admin, la API y Swagger. La contraseña se acepta para crear o cambiar una cuenta, se guarda mediante `set_password` y nunca se devuelve en la API.

Para verificar el proyecto:

```powershell
.\venv\Scripts\python.exe manage.py test
.\venv\Scripts\python.exe manage.py spectacular --validate
```
