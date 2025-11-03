<?php

namespace App\Http\Controllers;

use App\Services\BancoSoapServer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use SoapServer;
use SoapFault;

/**
 * Controlador que expone el servicio SOAP del banco
 * 
 * Este controlador actúa como el servidor SOAP externo.
 * En producción real, estaría en un servidor separado del banco.
 */
class BancoSoapServerController extends Controller
{
    /**
     * Endpoint para el servicio SOAP
     * Accesible en: http://tu-dominio.com/soap/banco
     */
    public function serve(Request $request)
    {
        // Si se solicita el WSDL, redirigir al método wsdl
        if ($request->has('wsdl') || $request->getQueryString() === 'wsdl') {
            return $this->wsdl();
        }

        // Deshabilitar caché WSDL para desarrollo
        ini_set('soap.wsdl_cache_enabled', '0');
        ini_set('soap.wsdl_cache_ttl', '0');

        try {
            // Ruta al archivo WSDL
            $wsdl = url('/soap/banco/wsdl');
            
            // Crear el servidor SOAP
            $server = new SoapServer($wsdl, [
                'soap_version' => SOAP_1_2,
                'encoding' => 'UTF-8',
                'uri' => url('/soap/banco'),
            ]);

            // Asociar el servicio con el servidor SOAP
            $server->setClass(BancoSoapServer::class);

            // Procesar la petición SOAP
            $server->handle();
            
            // No retornar nada, SoapServer::handle() ya envía la respuesta
            exit;

        } catch (SoapFault $e) {
            // Manejar errores SOAP
            Log::error('Error en servidor SOAP: ' . $e->getMessage());
            return response()->json([
                'error' => 'SOAP Error',
                'message' => $e->getMessage(),
            ], 500);
        } catch (\Exception $e) {
            Log::error('Error general en servidor SOAP: ' . $e->getMessage());
            return response()->json([
                'error' => 'Server Error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Genera el archivo WSDL dinámicamente
     * Accesible en: http://tu-dominio.com/soap/banco?wsdl
     */
    public function wsdl()
    {
        $namespace = url('/soap/banco');
        $location = url('/soap/banco');

        $wsdl = '<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
             xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
             xmlns:tns="' . $namespace . '"
             xmlns:xsd="http://www.w3.org/2001/XMLSchema"
             targetNamespace="' . $namespace . '"
             name="BancoFinanciamientoService">

    <types>
        <xsd:schema targetNamespace="' . $namespace . '">
            <!-- Tipo para consultarFinanciamiento -->
            <xsd:element name="consultarFinanciamientoRequest">
                <xsd:complexType>
                    <xsd:sequence>
                        <xsd:element name="precioVehiculo" type="xsd:float"/>
                        <xsd:element name="enganche" type="xsd:float"/>
                        <xsd:element name="plazoMaximo" type="xsd:int"/>
                    </xsd:sequence>
                </xsd:complexType>
            </xsd:element>
            
            <xsd:element name="consultarFinanciamientoResponse">
                <xsd:complexType>
                    <xsd:sequence>
                        <xsd:element name="banco" type="xsd:string"/>
                        <xsd:element name="precioVehiculo" type="xsd:float"/>
                        <xsd:element name="enganche" type="xsd:float"/>
                        <xsd:element name="montoFinanciar" type="xsd:float"/>
                        <xsd:element name="opciones" type="tns:ArrayOfOpcion"/>
                        <xsd:element name="fechaConsulta" type="xsd:string"/>
                        <xsd:element name="codigoRespuesta" type="xsd:string"/>
                        <xsd:element name="mensaje" type="xsd:string"/>
                    </xsd:sequence>
                </xsd:complexType>
            </xsd:element>
            
            <xsd:complexType name="ArrayOfOpcion">
                <xsd:sequence>
                    <xsd:element name="opcion" type="tns:OpcionFinanciamiento" minOccurs="0" maxOccurs="unbounded"/>
                </xsd:sequence>
            </xsd:complexType>
            
            <xsd:complexType name="OpcionFinanciamiento">
                <xsd:sequence>
                    <xsd:element name="plazo" type="xsd:int"/>
                    <xsd:element name="tasaInteres" type="xsd:float"/>
                    <xsd:element name="montoCuota" type="xsd:float"/>
                    <xsd:element name="totalPagar" type="xsd:float"/>
                    <xsd:element name="cft" type="xsd:float"/>
                    <xsd:element name="linea_nombre" type="xsd:string"/>
                </xsd:sequence>
            </xsd:complexType>
            
            <!-- Tipo para calcularCuota -->
            <xsd:element name="calcularCuotaRequest">
                <xsd:complexType>
                    <xsd:sequence>
                        <xsd:element name="monto" type="xsd:float"/>
                        <xsd:element name="tasaInteres" type="xsd:float"/>
                        <xsd:element name="plazoMeses" type="xsd:int"/>
                    </xsd:sequence>
                </xsd:complexType>
            </xsd:element>
            
            <xsd:element name="calcularCuotaResponse">
                <xsd:complexType>
                    <xsd:sequence>
                        <xsd:element name="cuotaMensual" type="xsd:float"/>
                        <xsd:element name="totalPagar" type="xsd:float"/>
                        <xsd:element name="interesesTotal" type="xsd:float"/>
                        <xsd:element name="capital" type="xsd:float"/>
                        <xsd:element name="tasaInteres" type="xsd:float"/>
                        <xsd:element name="plazoMeses" type="xsd:int"/>
                    </xsd:sequence>
                </xsd:complexType>
            </xsd:element>
            
            <!-- Tipo para validarElegibilidad -->
            <xsd:element name="validarElegibilidadRequest">
                <xsd:complexType>
                    <xsd:sequence>
                        <xsd:element name="dni" type="xsd:string"/>
                        <xsd:element name="ingresoMensual" type="xsd:float"/>
                    </xsd:sequence>
                </xsd:complexType>
            </xsd:element>
            
            <xsd:element name="validarElegibilidadResponse">
                <xsd:complexType>
                    <xsd:sequence>
                        <xsd:element name="esElegible" type="xsd:boolean"/>
                        <xsd:element name="montoMaximo" type="xsd:float"/>
                        <xsd:element name="mensaje" type="xsd:string"/>
                        <xsd:element name="codigoRespuesta" type="xsd:string"/>
                    </xsd:sequence>
                </xsd:complexType>
            </xsd:element>
        </xsd:schema>
    </types>

    <message name="consultarFinanciamientoRequest">
        <part name="parameters" element="tns:consultarFinanciamientoRequest"/>
    </message>
    
    <message name="consultarFinanciamientoResponse">
        <part name="parameters" element="tns:consultarFinanciamientoResponse"/>
    </message>
    
    <message name="calcularCuotaRequest">
        <part name="parameters" element="tns:calcularCuotaRequest"/>
    </message>
    
    <message name="calcularCuotaResponse">
        <part name="parameters" element="tns:calcularCuotaResponse"/>
    </message>
    
    <message name="validarElegibilidadRequest">
        <part name="parameters" element="tns:validarElegibilidadRequest"/>
    </message>
    
    <message name="validarElegibilidadResponse">
        <part name="parameters" element="tns:validarElegibilidadResponse"/>
    </message>

    <portType name="BancoFinanciamientoPortType">
        <operation name="consultarFinanciamiento">
            <input message="tns:consultarFinanciamientoRequest"/>
            <output message="tns:consultarFinanciamientoResponse"/>
        </operation>
        
        <operation name="calcularCuota">
            <input message="tns:calcularCuotaRequest"/>
            <output message="tns:calcularCuotaResponse"/>
        </operation>
        
        <operation name="validarElegibilidad">
            <input message="tns:validarElegibilidadRequest"/>
            <output message="tns:validarElegibilidadResponse"/>
        </operation>
    </portType>

    <binding name="BancoFinanciamientoBinding" type="tns:BancoFinanciamientoPortType">
        <soap:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>
        
        <operation name="consultarFinanciamiento">
            <soap:operation soapAction="' . $namespace . '#consultarFinanciamiento"/>
            <input>
                <soap:body use="literal"/>
            </input>
            <output>
                <soap:body use="literal"/>
            </output>
        </operation>
        
        <operation name="calcularCuota">
            <soap:operation soapAction="' . $namespace . '#calcularCuota"/>
            <input>
                <soap:body use="literal"/>
            </input>
            <output>
                <soap:body use="literal"/>
            </output>
        </operation>
        
        <operation name="validarElegibilidad">
            <soap:operation soapAction="' . $namespace . '#validarElegibilidad"/>
            <input>
                <soap:body use="literal"/>
            </input>
            <output>
                <soap:body use="literal"/>
            </output>
        </operation>
    </binding>

    <service name="BancoFinanciamientoService">
        <port name="BancoFinanciamientoPort" binding="tns:BancoFinanciamientoBinding">
            <soap:address location="' . $location . '"/>
        </port>
    </service>
</definitions>';

        return response($wsdl, 200)
            ->header('Content-Type', 'application/xml; charset=utf-8');
    }
}

