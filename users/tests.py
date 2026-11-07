from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient


User = get_user_model()


class UserApiTests(TestCase):
    def setUp(self):
        self.admin = User.objects.create_superuser(
            username='administrador',
            email='admin@example.com',
            password='ClaveSegura2026!',
        )
        self.other = User.objects.create_user(
            username='cliente',
            email='cliente@example.com',
            password='OtraClaveSegura2026!',
            telefono='6621234567',
        )
        self.client = APIClient()

    def test_login_con_email_y_datos_personales_con_jwt(self):
        response = self.client.post(
            reverse('auth-token'),
            {'email': 'cliente@example.com', 'password': 'OtraClaveSegura2026!'},
            format='json',
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn('access', response.data)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {response.data['access']}")
        me = self.client.get(reverse('auth-me'))
        self.assertEqual(me.status_code, 200)
        self.assertEqual(me.data['telefono'], '6621234567')
        self.assertNotIn('password', me.data)

    def test_datos_personales_sin_token_devuelve_401(self):
        response = self.client.get(reverse('auth-me'))
        self.assertEqual(response.status_code, 401)

    def test_crear_usuario_guarda_hash_y_no_expone_password(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(reverse('users-list'), {
            'username': 'nuevo',
            'email': 'nuevo@example.com',
            'telefono': '6620000000',
            'password': 'NuevaClaveSegura2026!',
        }, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertNotIn('password', response.data)
        self.assertEqual(response.data['telefono'], '6620000000')
        nuevo = User.objects.get(email='nuevo@example.com')
        self.assertTrue(nuevo.check_password('NuevaClaveSegura2026!'))
        self.assertNotEqual(nuevo.password, 'NuevaClaveSegura2026!')

    def test_password_debil_devuelve_400(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(reverse('users-list'), {
            'username': 'nuevo',
            'email': 'nuevo@example.com',
            'password': '123',
        }, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('password', response.data)

    def test_editar_otro_usuario_sin_password_conserva_su_hash(self):
        hash_anterior = self.other.password
        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(
            reverse('users-detail', args=[self.other.pk]),
            {'telefono': '6629999999'},
            format='json',
        )
        self.assertEqual(response.status_code, 200)
        self.assertNotIn('password', response.data)
        self.other.refresh_from_db()
        self.assertEqual(self.other.password, hash_anterior)
        self.assertTrue(self.other.check_password('OtraClaveSegura2026!'))
        self.assertEqual(self.other.telefono, '6629999999')

    def test_editar_con_password_cambia_solo_la_cuenta_destino(self):
        hash_admin = self.admin.password
        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(
            reverse('users-detail', args=[self.other.pk]),
            {'password': 'ClaveNuevaCliente2026!'},
            format='json',
        )
        self.assertEqual(response.status_code, 200)
        self.assertNotIn('password', response.data)
        self.other.refresh_from_db()
        self.admin.refresh_from_db()
        self.assertTrue(self.other.check_password('ClaveNuevaCliente2026!'))
        self.assertEqual(self.admin.password, hash_admin)

    def test_crud_de_usuarios_requiere_admin(self):
        self.client.force_authenticate(user=self.other)
        response = self.client.get(reverse('users-list'))
        self.assertEqual(response.status_code, 403)

    def test_registro_publico_crea_cliente_sin_exponer_password(self):
        response = self.client.post(reverse('auth-register'), {
            'username': 'nuevo_cliente',
            'email': 'nuevo_cliente@example.com',
            'first_name': 'Ana',
            'telefono': '6625551234',
            'password': 'ClaveNueva2026!',
            'password_confirm': 'ClaveNueva2026!',
            'is_staff': True,
        }, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertNotIn('password', response.data)
        self.assertNotIn('password_confirm', response.data)
        user = User.objects.get(email='nuevo_cliente@example.com')
        self.assertTrue(user.check_password('ClaveNueva2026!'))
        self.assertFalse(user.is_staff)
        self.assertEqual(user.telefono, '6625551234')

    def test_registro_rechaza_confirmacion_distinta(self):
        response = self.client.post(reverse('auth-register'), {
            'username': 'nuevo_cliente',
            'email': 'nuevo_cliente@example.com',
            'password': 'ClaveNueva2026!',
            'password_confirm': 'OtraClave2026!',
        }, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertFalse(User.objects.filter(email='nuevo_cliente@example.com').exists())

    def test_cors_solo_acepta_frontend_local(self):
        allowed = self.client.options(
            reverse('auth-token'),
            HTTP_ORIGIN='http://localhost:5173',
            HTTP_ACCESS_CONTROL_REQUEST_METHOD='POST',
        )
        self.assertEqual(allowed['Access-Control-Allow-Origin'], 'http://localhost:5173')
        denied = self.client.options(
            reverse('auth-token'),
            HTTP_ORIGIN='https://sitio-ajeno.example',
            HTTP_ACCESS_CONTROL_REQUEST_METHOD='POST',
        )
        self.assertNotIn('Access-Control-Allow-Origin', denied)
