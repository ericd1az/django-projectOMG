import re

from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import OpenApiParameter, extend_schema
from requests.exceptions import RequestException
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from zeep.exceptions import Error as ZeepError

from .models import Category, Product
from .serializers import CapitalSOAPSerializer, CategorySerializer, PrecioFinalSerializer, ProductSerializer
from .services import obtener_estrategia
from .soap_services import obtener_capital


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category']


@extend_schema(responses=PrecioFinalSerializer)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def precio_final(request, pk):
    producto = get_object_or_404(Product.objects.select_related('category'), pk=pk)
    estrategia = obtener_estrategia(producto.category.name)
    precio_con_descuento = estrategia.calcular(producto.price)
    return Response({
        'producto': producto.name,
        'categoria': producto.category.name,
        'precio_original': producto.price,
        'precio_final': precio_con_descuento,
    })


class CapitalSOAPView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        parameters=[OpenApiParameter(
            name='codigo',
            type=str,
            location=OpenApiParameter.QUERY,
            required=False,
            description='Código ISO de dos letras, por ejemplo MX.',
        )],
        responses={200: CapitalSOAPSerializer},
    )
    def get(self, request):
        codigo = request.query_params.get('codigo', 'MX').strip().upper()
        if not re.fullmatch(r'[A-Z]{2}', codigo):
            return Response(
                {'detail': 'Usa un código de país de dos letras, por ejemplo MX.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            capital = obtener_capital(codigo)
        except (RequestException, ZeepError):
            return Response(
                {'detail': 'El servicio SOAP no está disponible en este momento.'},
                status=status.HTTP_502_BAD_GATEWAY,
            )
        return Response({
            'codigo_pais': codigo,
            'capital': capital,
            'servicio': 'CountryInfoService (SOAP)',
        })
