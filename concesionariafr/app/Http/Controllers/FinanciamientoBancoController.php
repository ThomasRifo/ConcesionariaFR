<?php

namespace App\Http\Controllers;

use App\Services\BancoService;
use App\Models\Vehiculo;
use App\Models\LineaFinanciamiento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Exception;

/**
 * Controlador para consultar financiamiento desde un banco vía SOAP
 * 
 * Este controlador integra el servicio SOAP del banco con el sistema
 * de financiamiento de la concesionaria.
 */
class FinanciamientoBancoController extends Controller
{
    protected $bancoService;

    public function __construct(BancoService $bancoService)
    {
        $this->bancoService = $bancoService;
    }

    /**
     * Consulta opciones de financiamiento desde el banco para un vehículo
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function consultarFinanciamiento(Request $request)
    {
        try {
            $request->validate([
                'vehiculo_id' => 'required|exists:vehiculos,id',
                'enganche' => 'nullable|numeric|min:0',
                'plazo_maximo' => 'nullable|integer|min:12|max:60',
            ]);

            // Obtener el vehículo
            $vehiculo = Vehiculo::findOrFail($request->vehiculo_id);
            
            // Obtener precio del vehículo (asumiendo que tiene un campo precio)
            // Si no existe, usamos un precio por defecto o del request
            $precioVehiculo = $vehiculo->precio ?? $request->input('precio', 0);
            
            if ($precioVehiculo <= 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'El vehículo no tiene un precio válido',
                ], 400);
            }

            $enganche = $request->input('enganche', 0);
            $plazoMaximo = $request->input('plazo_maximo', 60);

            // Obtener líneas de financiamiento con sus cuotas
            $lineasFinanciamiento = LineaFinanciamiento::with('cuotas')->get()->toArray();
            
            // Formatear las líneas para el servicio
            $lineasFormateadas = array_map(function ($linea) {
                return [
                    'id' => $linea['id'],
                    'nombre' => $linea['nombre'],
                    'entidad' => $linea['entidad'],
                    'capitalMax' => $linea['capitalMax'],
                    'TNA' => $linea['TNA'],
                    'CFT' => $linea['CFT'],
                    'cuotas' => array_map(function ($cuota) {
                        return ['numeroCuotas' => $cuota['numeroCuotas']];
                    }, $linea['cuotas'] ?? []),
                ];
            }, $lineasFinanciamiento);

            // Consultar el banco vía SOAP con las líneas de financiamiento
            $resultado = $this->bancoService->consultarFinanciamiento(
                $precioVehiculo,
                $enganche,
                $plazoMaximo,
                $lineasFormateadas
            );

            return response()->json([
                'success' => true,
                'vehiculo' => [
                    'id' => $vehiculo->id,
                    'marca' => $vehiculo->marca ?? 'N/A',
                    'modelo' => $vehiculo->modelo ?? 'N/A',
                    'anio' => $vehiculo->anio ?? 'N/A',
                    'precio' => $precioVehiculo,
                ],
                'financiamiento' => $resultado,
            ]);

        } catch (Exception $e) {
            Log::error('Error al consultar financiamiento del banco: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error al consultar financiamiento: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Calcula la cuota mensual específica
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function calcularCuota(Request $request)
    {
        try {
            $request->validate([
                'monto' => 'required|numeric|min:1000',
                'tasa_interes' => 'required|numeric|min:0|max:100',
                'plazo_meses' => 'required|integer|min:1|max:60',
            ]);

            $monto = $request->input('monto');
            $tasaInteres = $request->input('tasa_interes');
            $plazoMeses = $request->input('plazo_meses');

            // Calcular cuota desde el banco vía SOAP
            $resultado = $this->bancoService->calcularCuota(
                $monto,
                $tasaInteres,
                $plazoMeses
            );

            return response()->json([
                'success' => true,
                'calculo' => $resultado,
            ]);

        } catch (Exception $e) {
            Log::error('Error al calcular cuota: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error al calcular cuota: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Valida si un cliente es elegible para financiamiento
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function validarElegibilidad(Request $request)
    {
        try {
            $request->validate([
                'dni' => 'required|string',
                'ingreso_mensual' => 'required|numeric|min:0',
            ]);

            $dni = $request->input('dni');
            $ingresoMensual = $request->input('ingreso_mensual');

            // Validar elegibilidad desde el banco vía SOAP
            $resultado = $this->bancoService->validarElegibilidad(
                $dni,
                $ingresoMensual
            );

            return response()->json([
                'success' => true,
                'elegibilidad' => $resultado,
            ]);

        } catch (Exception $e) {
            Log::error('Error al validar elegibilidad: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error al validar elegibilidad: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Compara financiamiento del banco con las líneas de financiamiento locales
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function compararOpciones(Request $request)
    {
        try {
            $request->validate([
                'vehiculo_id' => 'required|exists:vehiculos,id',
                'enganche' => 'nullable|numeric|min:0',
            ]);

            $vehiculo = Vehiculo::findOrFail($request->vehiculo_id);
            $precioVehiculo = $vehiculo->precio ?? $request->input('precio', 0);
            $enganche = $request->input('enganche', 0);

            // Obtener opciones del banco
            $opcionesBanco = $this->bancoService->consultarFinanciamiento(
                $precioVehiculo,
                $enganche,
                60
            );

            // Obtener líneas de financiamiento locales
            $lineasLocales = LineaFinanciamiento::with('cuotas')->get();

            $comparacion = [
                'vehiculo' => [
                    'id' => $vehiculo->id,
                    'marca' => $vehiculo->marca ?? 'N/A',
                    'modelo' => $vehiculo->modelo ?? 'N/A',
                    'precio' => $precioVehiculo,
                ],
                'banco' => $opcionesBanco,
                'lineas_locales' => $lineasLocales->map(function ($linea) use ($precioVehiculo, $enganche) {
                    return [
                        'id' => $linea->id,
                        'nombre' => $linea->nombre,
                        'entidad' => $linea->entidad,
                        'tna' => $linea->TNA,
                        'cft' => $linea->CFT,
                        'capital_max' => $linea->capitalMax,
                    ];
                }),
            ];

            return response()->json([
                'success' => true,
                'comparacion' => $comparacion,
            ]);

        } catch (Exception $e) {
            Log::error('Error al comparar opciones: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error al comparar opciones: ' . $e->getMessage(),
            ], 500);
        }
    }
}

