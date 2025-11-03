<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

/**
 * Servicio SOAP para consultar financiamiento de autos desde un banco
 * 
 * Este servicio simula la comunicación con un servicio SOAP de un banco
 * para obtener cotizaciones de financiamiento de vehículos.
 * 
 * En un caso real, este servicio se conectaría a:
 * - Banco Nación: https://api.banco.com/financiamiento?wsdl
 * - Banco Santander: https://api.santander.com/prestamos?wsdl
 * - etc.
 * 
 * Para este ejemplo, simulamos las respuestas del banco.
 */
class BancoService extends SoapService
{
    protected $useSoap = true;
    protected $wsdlUrl;

    /**
     * Constructor
     */
    public function __construct()
    {
        // Verificar si debemos usar SOAP o no
        // Por defecto desactivado para evitar problemas de timeout
        $this->useSoap = env('BANCO_USE_SOAP', false);
        
        if ($this->useSoap) {
            // URL del WSDL del servicio SOAP del banco
            // Si está configurado en .env, usa esa; si no, usa la URL local
            $this->wsdlUrl = env('BANCO_SOAP_WSDL_URL', url('/soap/banco/wsdl'));
            
            try {
                // Inicializar el cliente SOAP real con timeouts más cortos
                parent::__construct($this->wsdlUrl, [
                    'soap_version' => SOAP_1_2,
                    'trace' => true,
                    'exceptions' => true,
                    'cache_wsdl' => WSDL_CACHE_NONE,
                    'connection_timeout' => 10, // 10 segundos para conexión
                    'default_socket_timeout' => 10, // 10 segundos para socket
                ]);
            } catch (\Exception $e) {
                Log::warning('No se pudo inicializar cliente SOAP, usando modo directo', [
                    'error' => $e->getMessage(),
                ]);
                $this->useSoap = false;
            }
        }
    }

    /**
     * Consulta las opciones de financiamiento disponibles para un vehículo
     * 
     * @param float $precioVehículo Precio del vehículo
     * @param float $enganche Enganche inicial (opcional)
     * @param int $plazoMaximo Plazo máximo en meses (opcional)
     * @param array|null $lineasFinanciamiento Líneas de financiamiento disponibles (opcional)
     * @return array Opciones de financiamiento disponibles
     */
    public function consultarFinanciamiento($precioVehículo, $enganche = 0, $plazoMaximo = 60, $lineasFinanciamiento = null)
    {
        try {
            Log::info('Consultando financiamiento en banco vía SOAP', [
                'precioVehiculo' => $precioVehículo,
                'enganche' => $enganche,
                'plazoMaximo' => $plazoMaximo,
            ]);

            // Si SOAP está deshabilitado o no se pudo inicializar, usar modo directo
            if (!$this->useSoap || !isset($this->client)) {
                Log::info('Usando modo directo (sin SOAP) para consultar financiamiento');
                
                // Llamar directamente al servicio del banco
                $bancoSoapServer = new BancoSoapServer();
                $resultado = $bancoSoapServer->consultarFinanciamiento($precioVehículo, $enganche, $plazoMaximo);
                
                // Convertir resultado a formato esperado
                if (isset($resultado['bancos'])) {
                    return $resultado;
                } else {
                    return [
                        'bancos' => [$resultado],
                        'totalBancos' => 1,
                        'precioVehiculo' => $resultado['precioVehiculo'] ?? $precioVehículo,
                        'enganche' => $resultado['enganche'] ?? $enganche,
                        'montoFinanciar' => $resultado['montoFinanciar'] ?? ($precioVehículo - $enganche),
                        'fechaConsulta' => $resultado['fechaConsulta'] ?? now()->toDateTimeString(),
                    ];
                }
            }

            // Llamada SOAP REAL al servicio externo del banco
            try {
                // Establecer timeout para la llamada
                set_time_limit(30); // 30 segundos máximo
                
                $resultado = $this->call('consultarFinanciamiento', [
                    'precioVehiculo' => $precioVehículo,
                    'enganche' => $enganche,
                    'plazoMaximo' => $plazoMaximo,
                ]);

                // Convertir el objeto stdClass a array
                $resultadoArray = is_object($resultado) ? (array)$resultado : $resultado;
                
                Log::info('Respuesta SOAP recibida exitosamente', [
                    'banco' => $resultadoArray['banco'] ?? 'Desconocido',
                    'opciones' => count($resultadoArray['opciones'] ?? []),
                ]);
                
                return [
                    'bancos' => [[
                        'banco' => $resultadoArray['banco'] ?? 'Banco Nacional de Financiamiento',
                        'precioVehiculo' => $resultadoArray['precioVehiculo'] ?? $precioVehículo,
                        'enganche' => $resultadoArray['enganche'] ?? $enganche,
                        'montoFinanciar' => $resultadoArray['montoFinanciar'] ?? ($precioVehículo - $enganche),
                        'opciones' => $this->convertirOpcionesAArray($resultadoArray['opciones'] ?? []),
                        'fechaConsulta' => $resultadoArray['fechaConsulta'] ?? now()->toDateTimeString(),
                    ]],
                    'totalBancos' => 1,
                    'precioVehiculo' => $resultadoArray['precioVehiculo'] ?? $precioVehículo,
                    'enganche' => $resultadoArray['enganche'] ?? $enganche,
                    'montoFinanciar' => $resultadoArray['montoFinanciar'] ?? ($precioVehículo - $enganche),
                    'fechaConsulta' => $resultadoArray['fechaConsulta'] ?? now()->toDateTimeString(),
                ];

            } catch (\Exception $soapError) {
                // Si falla la conexión SOAP, usar modo directo
                Log::warning('Error en llamada SOAP, usando modo directo', [
                    'error' => $soapError->getMessage(),
                ]);

                // Llamar directamente al servicio del banco
                $bancoSoapServer = new BancoSoapServer();
                $resultado = $bancoSoapServer->consultarFinanciamiento($precioVehículo, $enganche, $plazoMaximo);
                
                if (isset($resultado['bancos'])) {
                    return $resultado;
                } else {
                    // Si tampoco funciona, usar líneas locales como último recurso
                    if ($lineasFinanciamiento && count($lineasFinanciamiento) > 0) {
                        return $this->simularRespuestaConLineas($precioVehículo, $enganche, $plazoMaximo, $lineasFinanciamiento);
                    }
                    
                    return [
                        'bancos' => [$resultado],
                        'totalBancos' => 1,
                        'precioVehiculo' => $resultado['precioVehiculo'] ?? $precioVehículo,
                        'enganche' => $resultado['enganche'] ?? $enganche,
                        'montoFinanciar' => $resultado['montoFinanciar'] ?? ($precioVehículo - $enganche),
                        'fechaConsulta' => $resultado['fechaConsulta'] ?? now()->toDateTimeString(),
                    ];
                }
            }
            
        } catch (\Exception $e) {
            Log::error('Error al consultar financiamiento en banco: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Convierte las opciones del objeto SOAP a array
     */
    protected function convertirOpcionesAArray($opciones)
    {
        $resultado = [];
        
        if (is_object($opciones) && isset($opciones->opcion)) {
            // Si es un objeto con propiedad opcion (puede ser array o objeto único)
            $opcionesArray = is_array($opciones->opcion) ? $opciones->opcion : [$opciones->opcion];
            
            foreach ($opcionesArray as $opcion) {
                $resultado[] = [
                    'plazo' => $opcion->plazo ?? 0,
                    'tasaInteres' => $opcion->tasaInteres ?? 0,
                    'montoCuota' => $opcion->montoCuota ?? 0,
                    'totalPagar' => $opcion->totalPagar ?? 0,
                    'cft' => $opcion->cft ?? 0,
                    'linea_nombre' => $opcion->linea_nombre ?? '',
                ];
            }
        } elseif (is_array($opciones)) {
            // Si ya es un array
            foreach ($opciones as $opcion) {
                $resultado[] = is_object($opcion) ? (array)$opcion : $opcion;
            }
        }
        
        return $resultado;
    }

    /**
     * Calcula la cuota mensual para un financiamiento específico
     * 
     * @param float $monto Monto a financiar
     * @param float $tasaInteres Tasa de interés anual
     * @param int $plazoMeses Plazo en meses
     * @return array Detalles del cálculo de cuota
     */
    public function calcularCuota($monto, $tasaInteres, $plazoMeses)
    {
        try {
            Log::info('Calculando cuota en banco vía SOAP', [
                'monto' => $monto,
                'tasaInteres' => $tasaInteres,
                'plazoMeses' => $plazoMeses,
            ]);

            // Llamada SOAP REAL
            $resultado = $this->call('calcularCuota', [
                'monto' => $monto,
                'tasaInteres' => $tasaInteres,
                'plazoMeses' => $plazoMeses,
            ]);

            // Convertir a array
            return [
                'cuotaMensual' => $resultado->cuotaMensual ?? 0,
                'totalPagar' => $resultado->totalPagar ?? 0,
                'interesesTotal' => $resultado->interesesTotal ?? 0,
                'capital' => $resultado->capital ?? $monto,
            ];
            
        } catch (\Exception $e) {
            Log::warning('Error en SOAP, usando cálculo local', ['error' => $e->getMessage()]);
            // Fallback a cálculo local
            return $this->calcularCuotaMensual($monto, $tasaInteres, $plazoMeses);
        }
    }

    /**
     * Valida si un cliente es elegible para financiamiento
     * 
     * @param string $dni DNI del cliente
     * @param float $ingresoMensual Ingreso mensual del cliente
     * @return array Información de elegibilidad
     */
    public function validarElegibilidad($dni, $ingresoMensual)
    {
        try {
            Log::info('Validando elegibilidad de cliente vía SOAP', [
                'dni' => $dni,
                'ingresoMensual' => $ingresoMensual,
            ]);

            // Llamada SOAP REAL
            $resultado = $this->call('validarElegibilidad', [
                'dni' => $dni,
                'ingresoMensual' => $ingresoMensual,
            ]);

            return [
                'esElegible' => $resultado->esElegible ?? false,
                'montoMaximo' => $resultado->montoMaximo ?? 0,
                'mensaje' => $resultado->mensaje ?? 'Error en validación',
                'codigoRespuesta' => $resultado->codigoRespuesta ?? 'ERROR',
            ];
            
        } catch (\Exception $e) {
            Log::warning('Error en SOAP, usando validación local', ['error' => $e->getMessage()]);
            // Fallback a validación local
            $esElegible = $ingresoMensual >= 50000;
            $montoMaximo = $esElegible ? $ingresoMensual * 36 : 0;
            
            return [
                'esElegible' => $esElegible,
                'montoMaximo' => $montoMaximo,
                'mensaje' => $esElegible 
                    ? 'Cliente elegible para financiamiento' 
                    : 'Cliente no cumple con los requisitos mínimos',
            ];
        }
    }

    /**
     * Simula la respuesta del banco con opciones de financiamiento
     * 
     * @param float $precioVehículo
     * @param float $enganche
     * @param int $plazoMaximo
     * @return array
     */
    protected function simularRespuestaBanco($precioVehículo, $enganche, $plazoMaximo)
    {
        $montoFinanciar = $precioVehículo - $enganche;
        
        // Diferentes opciones de financiamiento que ofrecería el banco
        $opciones = [];

        // Opción 1: 12 meses
        if ($plazoMaximo >= 12) {
            $tasa12 = 18.5; // 18.5% TNA
            $cuota12 = $this->calcularCuotaMensual($montoFinanciar, $tasa12, 12);
            $opciones[] = [
                'plazo' => 12,
                'tasaInteres' => $tasa12,
                'montoCuota' => $cuota12['cuotaMensual'],
                'totalPagar' => $cuota12['totalPagar'],
                'cft' => 22.5, // CFT: Costo Financiero Total
            ];
        }

        // Opción 2: 24 meses
        if ($plazoMaximo >= 24) {
            $tasa24 = 19.0;
            $cuota24 = $this->calcularCuotaMensual($montoFinanciar, $tasa24, 24);
            $opciones[] = [
                'plazo' => 24,
                'tasaInteres' => $tasa24,
                'montoCuota' => $cuota24['cuotaMensual'],
                'totalPagar' => $cuota24['totalPagar'],
                'cft' => 25.0,
            ];
        }

        // Opción 3: 36 meses
        if ($plazoMaximo >= 36) {
            $tasa36 = 19.5;
            $cuota36 = $this->calcularCuotaMensual($montoFinanciar, $tasa36, 36);
            $opciones[] = [
                'plazo' => 36,
                'tasaInteres' => $tasa36,
                'montoCuota' => $cuota36['cuotaMensual'],
                'totalPagar' => $cuota36['totalPagar'],
                'cft' => 27.5,
            ];
        }

        // Opción 4: 48 meses
        if ($plazoMaximo >= 48) {
            $tasa48 = 20.0;
            $cuota48 = $this->calcularCuotaMensual($montoFinanciar, $tasa48, 48);
            $opciones[] = [
                'plazo' => 48,
                'tasaInteres' => $tasa48,
                'montoCuota' => $cuota48['cuotaMensual'],
                'totalPagar' => $cuota48['totalPagar'],
                'cft' => 30.0,
            ];
        }

        // Opción 5: 60 meses
        if ($plazoMaximo >= 60) {
            $tasa60 = 20.5;
            $cuota60 = $this->calcularCuotaMensual($montoFinanciar, $tasa60, 60);
            $opciones[] = [
                'plazo' => 60,
                'tasaInteres' => $tasa60,
                'montoCuota' => $cuota60['cuotaMensual'],
                'totalPagar' => $cuota60['totalPagar'],
                'cft' => 32.5,
            ];
        }

        return [
            'banco' => 'Banco Nacional de Financiamiento',
            'precioVehiculo' => $precioVehículo,
            'enganche' => $enganche,
            'montoFinanciar' => $montoFinanciar,
            'opciones' => $opciones,
            'fechaConsulta' => now()->toDateTimeString(),
        ];
    }

    /**
     * Simula respuestas SOAP de múltiples bancos usando las líneas de financiamiento existentes
     * 
     * @param float $precioVehículo
     * @param float $enganche
     * @param int $plazoMaximo
     * @param array $lineasFinanciamiento
     * @return array
     */
    protected function simularRespuestaConLineas($precioVehículo, $enganche, $plazoMaximo, $lineasFinanciamiento)
    {
        $montoFinanciar = $precioVehículo - $enganche;
        $bancos = [];
        
        // Agrupar por entidad/banco
        $bancosAgrupados = [];
        foreach ($lineasFinanciamiento as $linea) {
            $entidad = $linea['entidad'] ?? 'Banco Desconocido';
            
            if (!isset($bancosAgrupados[$entidad])) {
                $bancosAgrupados[$entidad] = [];
            }
            
            $bancosAgrupados[$entidad][] = $linea;
        }
        
        // Para cada banco, generar opciones
        foreach ($bancosAgrupados as $entidad => $lineas) {
            $opcionesBanco = [];
            
            foreach ($lineas as $linea) {
                $capitalMax = $linea['capitalMax'] ?? PHP_INT_MAX;
                
                // Verificar si el monto a financiar no excede el capital máximo
                if ($montoFinanciar > $capitalMax) {
                    continue; // Saltar esta línea si excede el capital máximo
                }
                
                // Obtener cuotas disponibles para esta línea
                $cuotas = $linea['cuotas'] ?? [];
                $tna = $linea['TNA'] ?? 18.0;
                $cft = $linea['CFT'] ?? 20.0;
                $nombreLinea = $linea['nombre'] ?? 'Financiamiento';
                
                // Generar opciones para cada cuota disponible
                foreach ($cuotas as $cuota) {
                    $plazo = is_array($cuota) ? ($cuota['numeroCuotas'] ?? $cuota['numero_cuotas'] ?? 12) : $cuota;
                    
                    // Asegurar que el plazo no exceda el máximo solicitado
                    if ($plazo > $plazoMaximo) {
                        continue;
                    }
                    
                    // Calcular cuota usando la TNA de la línea
                    $calculo = $this->calcularCuotaMensual($montoFinanciar, $tna, $plazo);
                    
                    $opcionesBanco[] = [
                        'linea_id' => $linea['id'] ?? null,
                        'linea_nombre' => $nombreLinea,
                        'plazo' => $plazo,
                        'tasaInteres' => $tna,
                        'cft' => $cft,
                        'montoCuota' => $calculo['cuotaMensual'],
                        'totalPagar' => $calculo['totalPagar'],
                        'interesesTotal' => $calculo['interesesTotal'],
                        'capitalMax' => $capitalMax,
                    ];
                }
            }
            
            // Si hay opciones para este banco, agregarlo a la respuesta
            if (count($opcionesBanco) > 0) {
                $bancos[] = [
                    'banco' => $entidad,
                    'precioVehiculo' => $precioVehículo,
                    'enganche' => $enganche,
                    'montoFinanciar' => $montoFinanciar,
                    'opciones' => $opcionesBanco,
                    'fechaConsulta' => now()->toDateTimeString(),
                ];
            }
        }
        
        return [
            'bancos' => $bancos,
            'totalBancos' => count($bancos),
            'precioVehiculo' => $precioVehículo,
            'enganche' => $enganche,
            'montoFinanciar' => $montoFinanciar,
            'fechaConsulta' => now()->toDateTimeString(),
        ];
    }

    /**
     * Calcula la cuota mensual usando la fórmula de sistema francés
     * 
     * @param float $capital
     * @param float $tasaAnual
     * @param int $plazoMeses
     * @return array
     */
    protected function calcularCuotaMensual($capital, $tasaAnual, $plazoMeses)
    {
        // Convertir tasa anual a mensual
        $tasaMensual = ($tasaAnual / 100) / 12;
        
        // Fórmula de cuota fija (sistema francés)
        // Cuota = Capital * (tasa * (1 + tasa)^plazo) / ((1 + tasa)^plazo - 1)
        
        if ($tasaMensual == 0) {
            $cuotaMensual = $capital / $plazoMeses;
        } else {
            $factor = pow(1 + $tasaMensual, $plazoMeses);
            $cuotaMensual = $capital * ($tasaMensual * $factor) / ($factor - 1);
        }

        $totalPagar = $cuotaMensual * $plazoMeses;
        $interesesTotal = $totalPagar - $capital;

        return [
            'cuotaMensual' => round($cuotaMensual, 2),
            'totalPagar' => round($totalPagar, 2),
            'interesesTotal' => round($interesesTotal, 2),
            'capital' => $capital,
        ];
    }
}

