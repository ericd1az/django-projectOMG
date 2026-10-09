from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from .models import Category, Product


class CategoryTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.category = Category.objects.create(name='Electrónica')

    def test_create_category(self):
        response = self.client.post(
            '/api/categories/', {'name': 'Ropa'}, format='json'
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Category.objects.count(), 2)
        self.assertEqual(response.data['name'], 'Ropa')

    def test_list_categories(self):
        response = self.client.get('/api/categories/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Electrónica')


class ProductTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        user = get_user_model().objects.create_user(
            username='test_user', password='test123'
        )
        self.client.force_authenticate(user=user)
        self.category = Category.objects.create(name='Electrónica')
        self.product = Product.objects.create(
            name='Laptop',
            category=self.category,
            description='Laptop HP',
            price='15000.00',
        )

    def test_create_product(self):
        response = self.client.post('/api/products/', {
            'name': 'Mouse', 'category': self.category.id,
            'description': 'Mouse inalámbrico', 'price': '500.00',
        }, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Product.objects.count(), 2)
        self.assertEqual(response.data['category'], 'Electrónica')

    def test_list_products(self):
        response = self.client.get('/api/products/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Laptop')
        self.assertEqual(response.data[0]['category'], 'Electrónica')

    def test_update_product(self):
        response = self.client.put(f'/api/products/{self.product.id}/', {
            'name': 'Laptop Pro', 'category': self.category.id,
            'description': 'Laptop HP actualizada', 'price': '18000.00',
        }, format='json')
        self.assertEqual(response.status_code, 200)
        self.product.refresh_from_db()
        self.assertEqual(self.product.name, 'Laptop Pro')
        self.assertEqual(str(self.product.price), '18000.00')

    def test_delete_product(self):
        response = self.client.delete(f'/api/products/{self.product.id}/')
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Product.objects.filter(id=self.product.id).exists())

    def test_precio_final_autenticado(self):
        response = self.client.get(
            f'/api/products/{self.product.id}/precio-final/'
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['producto'], 'Laptop')
        self.assertEqual(response.data['categoria'], 'Electrónica')
        self.assertEqual(str(response.data['precio_final']), '13500.00')

    def test_precio_final_sin_autenticar(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(
            f'/api/products/{self.product.id}/precio-final/'
        )
        self.assertEqual(response.status_code, 401)
