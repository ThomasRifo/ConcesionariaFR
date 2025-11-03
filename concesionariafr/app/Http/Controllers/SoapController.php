<?php

namespace App\Http\Controllers;

use App\Services\SoapService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Exception;

/**
 * Controlador de ejemplo para demostrar el uso del servicio SOAP
 * 
 * Este controlador muestra diferentes formas de usar el servicio SOAP
 * en tu aplicación Laravel.
 */
class SoapController extends Controller
{
    protected $soapService;

    /**
     * Constructor
     * 
     * Puedes inyectar el servicio directamente o crear una instancia personalizada
     */
    public function __construct()
    {
        // El servicio se puede inicializar aquí o usar inyección de dependencias
        // $this->soapService = new SoapService();
    }

    /**
     * Ejemplo básico de llamada SOAP
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function ejemploBasico(Request $request)
    {
        try {
            // Crear una instancia del servicio SOAP
            $soapService = new SoapService();

            // Llamar a un método del servicio SOAP
            // Reemplaza 'MetodoEjemplo' con el nombre real del método de tu servicio
            $resultado = $soapService->call('MetodoEjemplo', [
                'parametro1' => $request->input('parametro1', 'valor1'),
                'parametro2' => $request->input('parametro2', 'valor2'),
            ]);

            return response()->json([
                'success' => true,
                'data' => $resultado,
            ]);
        } catch (Exception $e) {
            Log::error('Error en llamada SOAP básica: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error al realizar la llamada SOAP: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Ejemplo con autenticación
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function ejemploConAutenticacion(Request $request)
    {
        try {
            $soapService = new SoapService();
            
            // Configurar autenticación
            $soapService->setAuth(
                $request->input('usuario', env('SOAP_USERNAME')),
                $request->input('contraseña', env('SOAP_PASSWORD'))
            );

            // Llamar al método
            $resultado = $soapService->call('MetodoProtegido', [
                'datos' => $request->input('datos'),
            ]);

            return response()->json([
                'success' => true,
                'data' => $resultado,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Ejemplo con headers personalizados
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function ejemploConHeaders(Request $request)
    {
        try {
            $soapService = new SoapService();
            
            // Agregar headers personalizados
            $soapService->addHeader(
                'http://ejemplo.com/namespace',
                'HeaderName',
                [
                    'campo1' => 'valor1',
                    'campo2' => 'valor2',
                ]
            );

            $resultado = $soapService->call('MetodoConHeader', [
                'parametros' => $request->input('parametros'),
            ]);

            return response()->json([
                'success' => true,
                'data' => $resultado,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtener funciones disponibles del servicio SOAP
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function obtenerFunciones()
    {
        try {
            $soapService = new SoapService();
            
            $funciones = $soapService->getFunctions();
            $tipos = $soapService->getTypes();

            return response()->json([
                'success' => true,
                'funciones' => $funciones,
                'tipos' => $tipos,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Debug: Obtener información de la última petición/respuesta
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function debug(Request $request)
    {
        try {
            $soapService = new SoapService();
            
            // Realizar una llamada de prueba
            $soapService->call('MetodoEjemplo', $request->all());

            return response()->json([
                'success' => true,
                'debug' => [
                    'last_request' => $soapService->getLastRequest(),
                    'last_response' => $soapService->getLastResponse(),
                    'last_request_headers' => $soapService->getLastRequestHeaders(),
                    'last_response_headers' => $soapService->getLastResponseHeaders(),
                ],
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'last_request' => $soapService->getLastRequest() ?? null,
                'last_response' => $soapService->getLastResponse() ?? null,
            ], 500);
        }
    }

    /**
     * Ejemplo con servicio SOAP personalizado (WSDL diferente)
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function ejemploPersonalizado(Request $request)
    {
        try {
            // Crear servicio con WSDL personalizado
            $wsdlPersonalizado = $request->input('wsdl');
            $opciones = [
                'soap_version' => SOAP_1_2,
                'trace' => true,
            ];

            $soapService = new SoapService($wsdlPersonalizado, $opciones);

            $resultado = $soapService->call('MetodoPersonalizado', [
                'datos' => $request->input('datos'),
            ]);

            return response()->json([
                'success' => true,
                'data' => $resultado,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}

