<?php

namespace App\Services;

use App\Models\External\Banco as BancoExterno;
use App\Models\External\LineaFinanciamientoExterna;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

/**
 * Servidor SOAP que se conecta a base de datos externa de bancos
 * 
 * Este servicio actúa como si fuera un servicio SOAP externo de un banco real.
 * Lee los datos de una base de datos externa separada.
 * 
 * Métodos disponibles vía SOAP:
 * - consultarFinanciamiento
 * - calcularCuota
 * - validarElegibilidad
 */
class BancoSoapServer
{
    /**
     * Consulta opciones de financiamiento disponibles
     * 
     * @param float $precioVehiculo Precio del vehículo
     * @param float $enganche Enganche inicial
     * @param int $plazoMaximo Plazo máximo en meses
     * @return array Opciones de financiamiento
     */
    public function consultarFinanciamiento($precioVehiculo, $enganche, $plazoMaximo)
    {
        Log::info('Servidor SOAP: consultarFinanciamiento llamado', [
            'precioVehiculo' => $precioVehiculo,
            'enganche' => $enganche,
            'plazoMaximo' => $plazoMaximo,
        ]);

        $montoFinanciar = $precioVehiculo - $enganche;
        $opciones = [];
        $bancosData = [];

        try {
            // Consultar bancos activos desde la base de datos externa
            // Ajustar según la estructura de tu base de datos externa
            
            // Opción 1: Si usas los modelos Eloquent
            $bancos = BancoExterno::where('activo', 1)
                ->with(['lineasFinanciamiento.cuotas' => function($query) {
                    $query->where('activo', 1);
                }])
                ->get();

            // Opción 2: Si prefieres consulta directa con Query Builder
            // $bancos = DB::connection('bancos')
            //     ->table('bancos')
            //     ->where('activo', 1)
            //     ->get();

            foreach ($bancos as $banco) {
                $opcionesBanco = [];
                
                // Obtener líneas de financiamiento del banco
                $lineas = $banco->lineasFinanciamiento()
                    ->where('activo', 1)
                    ->where('capital_max', '>=', $montoFinanciar)
                    ->with('cuotas')
                    ->get();

                foreach ($lineas as $linea) {
                    // Obtener cuotas disponibles para esta línea
                    $cuotas = $linea->cuotas()
                        ->where('activo', 1)
                        ->where('numero_cuotas', '<=', $plazoMaximo)
                        ->get();

                    foreach ($cuotas as $cuota) {
                        $plazo = $cuota->numero_cuotas;
                        
                        // Calcular cuota usando la tasa de interés de la línea
                        $tasaInteres = $linea->tasa_interes ?? 18.0;
                        $cuotaMensual = $this->calcularCuotaMensual($montoFinanciar, $tasaInteres, $plazo);
                        
                        $opcionesBanco[] = [
                            'linea_id' => $linea->id,
                            'linea_nombre' => $linea->nombre,
                            'plazo' => $plazo,
                            'tasaInteres' => $tasaInteres,
                            'montoCuota' => round($cuotaMensual, 2),
                            'totalPagar' => round($cuotaMensual * $plazo, 2),
                            'cft' => $linea->cft ?? 20.0,
                        ];
                    }
                }

                if (count($opcionesBanco) > 0) {
                    $bancosData[] = [
                        'banco' => $banco->nombre ?? 'Banco Desconocido',
                        'precioVehiculo' => $precioVehiculo,
                        'enganche' => $enganche,
                        'montoFinanciar' => $montoFinanciar,
                        'opciones' => $opcionesBanco,
                    ];
                }
            }

            // Si no hay bancos en la BD externa, usar fallback
            if (empty($bancosData)) {
                Log::warning('No se encontraron bancos en BD externa, usando fallback');
                return $this->consultarFinanciamientoFallback($precioVehiculo, $enganche, $plazoMaximo);
            }

            // Si hay solo un banco, retornar formato simple; si hay varios, retornar todos
            if (count($bancosData) === 1) {
                return array_merge($bancosData[0], [
                    'fechaConsulta' => date('Y-m-d H:i:s'),
                    'codigoRespuesta' => 'OK',
                    'mensaje' => 'Consulta realizada exitosamente',
                ]);
            } else {
                return [
                    'bancos' => $bancosData,
                    'totalBancos' => count($bancosData),
                    'precioVehiculo' => $precioVehiculo,
                    'enganche' => $enganche,
                    'montoFinanciar' => $montoFinanciar,
                    'fechaConsulta' => date('Y-m-d H:i:s'),
                    'codigoRespuesta' => 'OK',
                    'mensaje' => 'Consulta realizada exitosamente',
                ];
            }

        } catch (\Exception $e) {
            Log::error('Error al consultar BD externa de bancos: ' . $e->getMessage(), [
                'exception' => $e,
            ]);
            
            // Fallback si hay error de conexión
            return $this->consultarFinanciamientoFallback($precioVehiculo, $enganche, $plazoMaximo);
        }
    }

    /**
     * Método fallback si no hay conexión a la BD externa
     */
    protected function consultarFinanciamientoFallback($precioVehiculo, $enganche, $plazoMaximo)
    {
        $montoFinanciar = $precioVehiculo - $enganche;
        $opciones = [];

        // Opciones básicas como fallback
        if ($plazoMaximo >= 12) {
            $tasa12 = 15.5;
            $cuota12 = $this->calcularCuotaMensual($montoFinanciar, $tasa12, 12);
            $opciones[] = [
                'plazo' => 12,
                'tasaInteres' => $tasa12,
                'montoCuota' => round($cuota12, 2),
                'totalPagar' => round($cuota12 * 12, 2),
                'cft' => 18.3,
                'linea_nombre' => 'Plan Básico 12 meses',
            ];
        }

        return [
            'banco' => 'Banco Nacional de Financiamiento',
            'precioVehiculo' => $precioVehiculo,
            'enganche' => $enganche,
            'montoFinanciar' => $montoFinanciar,
            'opciones' => $opciones,
            'fechaConsulta' => date('Y-m-d H:i:s'),
            'codigoRespuesta' => 'OK',
            'mensaje' => 'Consulta realizada exitosamente (modo fallback)',
        ];
    }

    /**
     * Calcula la cuota mensual para un financiamiento
     * 
     * @param float $monto Monto a financiar
     * @param float $tasaInteres Tasa de interés anual
     * @param int $plazoMeses Plazo en meses
     * @return array Detalles del cálculo
     */
    public function calcularCuota($monto, $tasaInteres, $plazoMeses)
    {
        Log::info('Servidor SOAP: calcularCuota llamado', [
            'monto' => $monto,
            'tasaInteres' => $tasaInteres,
            'plazoMeses' => $plazoMeses,
        ]);

        $cuotaMensual = $this->calcularCuotaMensual($monto, $tasaInteres, $plazoMeses);
        $totalPagar = $cuotaMensual * $plazoMeses;
        $interesesTotal = $totalPagar - $monto;

        return [
            'cuotaMensual' => round($cuotaMensual, 2),
            'totalPagar' => round($totalPagar, 2),
            'interesesTotal' => round($interesesTotal, 2),
            'capital' => $monto,
            'tasaInteres' => $tasaInteres,
            'plazoMeses' => $plazoMeses,
        ];
    }

    /**
     * Valida si un cliente es elegible para financiamiento
     * 
     * @param string $dni DNI del cliente
     * @param float $ingresoMensual Ingreso mensual
     * @return array Información de elegibilidad
     */
    public function validarElegibilidad($dni, $ingresoMensual)
    {
        Log::info('Servidor SOAP: validarElegibilidad llamado', [
            'dni' => $dni,
            'ingresoMensual' => $ingresoMensual,
        ]);

        $esElegible = $ingresoMensual >= 50000;
        $montoMaximo = $esElegible ? $ingresoMensual * 36 : 0;

        return [
            'esElegible' => $esElegible,
            'montoMaximo' => round($montoMaximo, 2),
            'mensaje' => $esElegible 
                ? 'Cliente elegible para financiamiento' 
                : 'Cliente no cumple con los requisitos mínimos',
            'codigoRespuesta' => $esElegible ? 'OK' : 'RECHAZADO',
        ];
    }

    /**
     * Calcula la cuota mensual usando la fórmula de sistema francés
     * 
     * @param float $capital
     * @param float $tasaAnual
     * @param int $plazoMeses
     * @return float
     */
    protected function calcularCuotaMensual($capital, $tasaAnual, $plazoMeses)
    {
        $tasaMensual = ($tasaAnual / 100) / 12;
        
        if ($tasaMensual == 0) {
            return $capital / $plazoMeses;
        }
        
        $factor = pow(1 + $tasaMensual, $plazoMeses);
        return $capital * ($tasaMensual * $factor) / ($factor - 1);
    }
}

