from rest_framework import serializers

from .models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class CategoryNameRelatedField(serializers.PrimaryKeyRelatedField):
    def use_pk_only_optimization(self):
        return False

    def to_representation(self, value):
        return str(value)


class ProductSerializer(serializers.ModelSerializer):
    category = CategoryNameRelatedField(queryset=Category.objects.all())

    class Meta:
        model = Product
        fields = (
            'id',
            'name',
            'description',
            'price',
            'category',
        )


class PrecioFinalSerializer(serializers.Serializer):
    producto = serializers.CharField()
    categoria = serializers.CharField()
    precio_original = serializers.DecimalField(max_digits=10, decimal_places=2)
    precio_final = serializers.DecimalField(max_digits=10, decimal_places=2)


class CapitalSOAPSerializer(serializers.Serializer):
    codigo_pais = serializers.CharField()
    capital = serializers.CharField()
    servicio = serializers.CharField()
