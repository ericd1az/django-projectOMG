from zeep import Client
from zeep.transports import Transport


WSDL_PAISES = 'http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso?WSDL'


def obtener_capital(codigo_pais):
    transport = Transport(timeout=10, operation_timeout=10)
    client = Client(WSDL_PAISES, transport=transport)
    return client.service.CapitalCity(codigo_pais)
