from decimal import Decimal, ROUND_HALF_UP
from unicodedata import normalize


CENTAVOS = Decimal('0.01')


class EstrategiaDescuento:
    def calcular(self, precio):
        raise NotImplementedError


class DescuentoElectronica(EstrategiaDescuento):
    def calcular(self, precio):
        return (precio * Decimal('0.90')).quantize(CENTAVOS, rounding=ROUND_HALF_UP)


class DescuentoRopa(EstrategiaDescuento):
    def calcular(self, precio):
        return (precio * Decimal('0.80')).quantize(CENTAVOS, rounding=ROUND_HALF_UP)


class SinDescuento(EstrategiaDescuento):
    def calcular(self, precio):
        return precio.quantize(CENTAVOS, rounding=ROUND_HALF_UP)


def obtener_estrategia(categoria_nombre):
    nombre = ''.join(
        letra for letra in normalize('NFD', categoria_nombre.casefold())
        if letra.isascii()
    )
    estrategias = {
        'electronica': DescuentoElectronica,
        'ropa': DescuentoRopa,
    }
    return estrategias.get(nombre, SinDescuento)()
