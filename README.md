# NOVA — Tienda de Tecnología

Tienda de tecnología con Django REST Framework, MySQL y React. Incluye catálogo, categorías, descuentos, registro e inicio de sesión con JWT, panel personal, clima de Open-Meteo y consulta SOAP de capitales. La API se documenta en Swagger.

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

Si ya tienes una base antigua creada antes de agregar `users.User`, conserva las cuentas existentes: haz una copia de seguridad y adapta el historial de migraciones antes de ejecutar `migrate`.

En otra terminal, inicia la interfaz:

```powershell
cd frontend
Copy-Item .env.example .env.local
npm ci
npm run dev
```

Abre `http://127.0.0.1:5173/`. Si cambias el puerto de Django, actualiza `VITE_BASE_API_URL` en `frontend/.env.local`. Ese archivo se ignora en Git. La interfaz usa React Router v6, Formik, Yup, Semantic UI React y Sass. El token de acceso se conserva en el navegador y se valida con `/api/v1/auth/me/` al volver a abrir la página.

## Rutas principales

| Ruta | Uso |
| --- | --- |
| `/swagger/` | Documentación y pruebas interactivas |
| `/api/v1/auth/token/` | Obtener access y refresh con `email` y `password` |
| `/api/v1/auth/token/refresh/` | Renovar el token de acceso |
| `/api/v1/auth/me/` | Datos de la cuenta autenticada |
| `/api/v1/auth/register/` | Registro público de clientes |
| `/api/v1/users/` | CRUD de usuarios, solo administradores |
| `/api/categories/` | Categorías |
| `/api/products/` | Productos, con JWT |
| `/api/v1/services/capital/?codigo=MX` | Capital de un país mediante servicio SOAP, con JWT |

En Swagger, pulsa **Authorize** e introduce solo el token de acceso. Swagger agregará `Bearer` al encabezado. El token de acceso dura 30 minutos. El campo `telefono` se muestra en el admin, la API y Swagger. La contraseña se acepta para crear o cambiar una cuenta, se guarda mediante `set_password` y nunca se devuelve en la API.

El backend permite CORS solo desde `http://127.0.0.1:5173` y `http://localhost:5173`. El widget de clima usa [Open-Meteo](https://open-meteo.com/en/docs) sin clave para uso no comercial. El servicio SOAP usa `CountryInfoService` mediante Zeep; requiere conexión a Internet. En el login, la consola muestra solo los primeros caracteres del token para verificar su obtención sin exponerlo completo en capturas.

## Comprobaciones

```powershell
.\venv\Scripts\python.exe manage.py test
.\venv\Scripts\python.exe manage.py spectacular --validate
cd frontend
npm run lint
npm run build
```
