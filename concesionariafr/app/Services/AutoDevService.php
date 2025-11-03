<?php

namespace App\Services;

use App\Models\Combustible;
use App\Models\Transmision;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AutoDevService
{
    protected $apiKey;
    protected $baseUrl;

    public function __construct()
    {
        $this->apiKey = config('services.autodev.api_key');
        $this->baseUrl = config('services.autodev.base_url', 'https://api.auto.dev');
    }

    /**
     * Decodifica un VIN y obtiene información del vehículo
     *
     * @param string $vin El número de identificación del vehículo
     * @return array|null Retorna los datos del vehículo o null si hay error
     */
    public function decodeVin(string $vin): array
    {
        if (empty($this->apiKey)) {
            Log::warning('Auto.dev API key no configurada');
            return [
                'success' => false,
                'error' => 'API key no configurada. Por favor, configure AUTO_DEV_API_KEY en el archivo .env',
            ];
        }

        try {
            // Intentar primero con /listings/{vin} que tiene más información completa
            $url = "{$this->baseUrl}/listings/{$vin}";
            
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Accept' => 'application/json',
            ])->timeout(10)->get($url);

            if ($response->successful()) {
                $data = $response->json();
                
                // Log temporal para depuración
                Log::info('Respuesta de listings API', [
                    'vin' => $vin,
                    'has_data' => isset($data['data']),
                ]);
                
                // El endpoint /listings/{vin} envuelve en {data: {listing object}}
                if (isset($data['data']) && is_array($data['data']) && !empty($data['data'])) {
                    $listing = $data['data'];
                    
                    // Verificar que tenga información de vehicle
                    if (isset($listing['vehicle']) && !empty($listing['vehicle'])) {
                        // Normalizar los datos para nuestro modelo
                        $normalizedData = $this->normalizeVehicleDataFromListing($listing);
                        $normalizedData['success'] = true;
                        
                        return $normalizedData;
                    }
                }
            } elseif ($response->status() !== 404) {
                // Si es un error distinto de 404, loguear pero continuar con fallback
                Log::warning('Error en listings API (no 404)', [
                    'vin' => $vin,
                    'status' => $response->status(),
                ]);
            }
            
            // Si /listings falla, intentar con /specs/{vin} (solo disponible en planes premium)
            // Este endpoint falla silenciosamente si no está disponible, sin afectar el flujo
            Log::info('Listings no disponible, intentando con /specs/{vin} (puede requerir plan premium)', ['vin' => $vin]);
            
            $url = "{$this->baseUrl}/specs/{$vin}";
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Accept' => 'application/json',
            ])->timeout(10)->get($url);

            if ($response->successful()) {
                $data = $response->json();
                
                Log::info('Respuesta de specs API obtenida (plan premium activo)', [
                    'vin' => $vin,
                    'keys' => array_keys($data),
                ]);
                
                // El endpoint /specs puede tener estructura similar a listings
                $specsData = $data;
                if (isset($data['data'])) {
                    $specsData = $data['data'];
                }
                
                // Normalizar los datos - specs puede tener estructura similar a listings
                if (isset($specsData['vehicle'])) {
                    // Si tiene estructura de listing, usar ese método
                    $normalizedData = $this->normalizeVehicleDataFromListing($specsData);
                } else {
                    // Si no, usar el método genérico
                    $normalizedData = $this->normalizeVehicleData($specsData);
                }
                $normalizedData['success'] = true;
                
                return $normalizedData;
            } else {
                // Si specs falla (404, 403, etc.), continuar silenciosamente al siguiente endpoint
                Log::info('Specs API no disponible o requiere plan premium, continuando con endpoint básico', [
                    'vin' => $vin,
                    'status' => $response->status(),
                ]);
            }
            
            // Si specs también falla o no está disponible, usar /vin/{vin} como fallback final
            Log::info('Usando /vin/{vin} como fallback final', ['vin' => $vin]);
            
            $url = "{$this->baseUrl}/vin/{$vin}";
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Accept' => 'application/json',
            ])->timeout(10)->get($url);

            if ($response->successful()) {
                $data = $response->json();
                
                // Si la respuesta viene envuelta en 'data', extraerla
                if (isset($data['data']) && is_array($data['data'])) {
                    if (isset($data['data']['vehicle']) || isset($data['data']['make'])) {
                        $data = $data['data'];
                    } elseif (is_array($data['data']) && count($data['data']) > 0 && isset($data['data'][0])) {
                        $data = $data['data'][0];
                    }
                }
                
                // Normalizar los datos para nuestro modelo
                $normalizedData = $this->normalizeVehicleData($data);
                $normalizedData['success'] = true;
                
                return $normalizedData;
            }

            $errorBody = $response->body();
            $statusCode = $response->status();
            
            Log::warning('Error al decodificar VIN', [
                'vin' => $vin,
                'status' => $statusCode,
                'response' => $errorBody,
                'url' => $url,
            ]);

            return [
                'success' => false,
                'error' => "Error de la API (Código: {$statusCode})",
                'status' => $statusCode,
                'response' => $errorBody,
            ];
        } catch (\Illuminate\Http\Client\ConnectionException $e) {
            Log::error('Error de conexión con API Auto.dev', [
                'vin' => $vin,
                'error' => $e->getMessage(),
                'url' => "{$this->baseUrl}/vin/{$vin}",
            ]);

            return [
                'success' => false,
                'error' => 'No se pudo conectar con la API. Verifique su conexión a internet y la configuración de la API.',
            ];
        } catch (\Exception $e) {
            Log::error('Excepción al consumir API Auto.dev', [
                'vin' => $vin,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'success' => false,
                'error' => 'Error inesperado: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Normaliza los datos del endpoint /listings/{vin} al formato de nuestro modelo
     * Este endpoint tiene estructura más completa con vehicle.* dentro de un listing
     *
     * @param array $listingData Datos del listing (viene con vehicle, retailListing, etc.)
     * @return array Datos normalizados
     */
    protected function normalizeVehicleDataFromListing(array $listingData): array
    {
        // El listing tiene vehicle, retailListing, etc.
        $vehicle = $listingData['vehicle'] ?? [];
        
        // Extraer datos del vehicle
        $marca = $vehicle['make'] ?? null;
        $modelo = $vehicle['model'] ?? null;
        $anio = $vehicle['year'] ?? null;
        $trim = $vehicle['trim'] ?? null;
        $style = $vehicle['bodyStyle'] ?? null;
        $color = $vehicle['exteriorColor'] ?? $vehicle['interiorColor'] ?? null;
        $numPuertas = $vehicle['doors'] ?? null;
        
        // Información del motor - puede venir como string "2.0L" o "Plug-In Hybrid"
        $engineString = $vehicle['engine'] ?? null;
        $tipoMotor = null;
        $cilindrada = null;
        
        if ($engineString) {
            // Intentar extraer información del string del motor
            if (preg_match('/(\d+\.\d+L?)/i', $engineString, $matches)) {
                $cilindrada = $matches[1];
            }
            $tipoMotor = $engineString; // Guardar el string completo como tipo de motor
        }
        
        // Potencia no viene en listings normalmente
        
        // Combustible y transmisión
        $fuelType = $vehicle['fuel'] ?? null;
        $transmissionType = $vehicle['transmission'] ?? null;
        
        // Mapear a IDs locales
        $idCombustible = $this->mapFuelTypeToId($fuelType);
        $idTransmision = $this->mapTransmissionTypeToId($transmissionType);
        
        // Combinar modelo con trim si existe
        if ($trim && $modelo && !str_contains(strtolower($modelo), strtolower($trim))) {
            $modelo = trim("{$modelo} {$trim}");
        }
        
        // País de origen no viene en listings, mantener null o buscar en otro lugar
        
        return [
            'marca' => $marca,
            'modelo' => $modelo,
            'anio' => $anio ? (string)$anio : null,
            'color' => $color,
            'detalles' => $style,
            'pais_origen' => null, // No disponible en listings
            'tipo_motor' => $tipoMotor,
            'cilindrada' => $cilindrada,
            'potencia' => null, // No disponible en listings
            'num_puertas' => $numPuertas ? (int)$numPuertas : null,
            'idCombustible' => $idCombustible,
            'idTransmision' => $idTransmision,
            'trim' => $trim,
            'style' => $style,
            'raw_data' => $listingData,
        ];
    }

    /**
     * Normaliza los datos de la API al formato de nuestro modelo
     *
     * @param array $apiData Datos crudos de la API
     * @return array Datos normalizados
     */
    protected function normalizeVehicleData(array $apiData): array
    {
        // La estructura puede variar, buscar en múltiples ubicaciones
        // Log detallado para debugging
        Log::info('Estructura completa de API recibida', ['keys' => array_keys($apiData)]);
        
        // Función helper para buscar valor en múltiples rutas
        $getValue = function($paths, $data) {
            foreach ($paths as $path) {
                $keys = explode('.', $path);
                $value = $data;
                foreach ($keys as $key) {
                    if (isset($value[$key])) {
                        $value = $value[$key];
                    } else {
                        $value = null;
                        break;
                    }
                }
                if ($value !== null) {
                    return $value;
                }
            }
            return null;
        };
        
        // Obtener marca: buscar primero en vehicle.* según la documentación
        // También buscar en nivel raíz directamente
        $marca = $getValue([
            'make',  // Nivel raíz primero según tu estructura
            'vehicle.make',
            'manufacturer',
            'vehicle.manufacturer',
            'data.vehicle.make',
            'data.make',
            'result.vehicle.make',
            'result.make'
        ], $apiData);
        
        // Log para debug
        if ($marca) {
            Log::info('Marca encontrada', ['marca' => $marca, 'source' => 'normalizeVehicleData']);
        } else {
            Log::warning('Marca no encontrada', ['available_keys' => array_keys($apiData)]);
        }
            
        // Obtener modelo: buscar primero en nivel raíz (según tu ejemplo, viene ahí)
        $modelo = $getValue([
            'model',  // Nivel raíz primero según tu ejemplo
            'vehicle.model',
            'data.vehicle.model',
            'data.model',
            'result.vehicle.model',
            'result.model'
        ], $apiData);
            
        // Obtener año: buscar primero en vehicle.year según tu ejemplo del Jeep
        $anio = $getValue([
            'vehicle.year',  // Primer lugar según ejemplo
            'year',
            'modelYear',
            'data.vehicle.year',
            'data.year',
            'result.vehicle.year',
            'result.year',
            'vehicle.yearModel'
        ], $apiData);
        
        // Si no hay año pero hay array de years, usar el más reciente
        if (!$anio && isset($apiData['years']) && is_array($apiData['years']) && count($apiData['years']) > 0) {
            $anio = max($apiData['years']); // Obtener el año más reciente
            Log::info('Año obtenido del array years', ['years' => $apiData['years'], 'selected' => $anio]);
        }
            
        // Color: buscar en vehicle.exteriorColor según la documentación
        $color = $getValue([
            'vehicle.exteriorColor',
            'vehicle.interiorColor',
            'exteriorColor',
            'exteriorColorName',
            'color',
            'vehicle.color',
            'data.vehicle.exteriorColor',
            'data.exteriorColor'
        ], $apiData);
        
        // Obtener trim y bodyStyle (que es el style según la documentación)
        $trim = $getValue([
            'trim',  // Nivel raíz primero
            'vehicle.trim',
            'data.vehicle.trim',
            'data.trim'
        ], $apiData);
        
        // Style puede venir como 'style' en nivel raíz (según tu ejemplo)
        $style = $getValue([
            'style',  // Nivel raíz primero según tu ejemplo
            'vehicle.bodyStyle',
            'bodyStyle',
            'vehicle.style',
            'data.vehicle.bodyStyle',
            'data.bodyStyle'
        ], $apiData);
        
        // Combinar modelo con trim si existe
        if ($trim && $modelo && !str_contains(strtolower($modelo), strtolower($trim))) {
            $modelo = trim("{$modelo} {$trim}");
        }
        
        // Obtener país de origen
        $paisOrigen = $getValue([
            'origin',
            'vehicle.origin',
            'country',
            'vehicle.country',
            'data.origin',
            'data.vehicle.origin'
        ], $apiData);
        
        // Obtener información del motor
        // Según la documentación, vehicle.engine puede ser un string
        $engineString = $getValue([
            'vehicle.engine',
            'engine',
            'data.vehicle.engine',
            'data.engine'
        ], $apiData);
        
        $tipoMotor = null;
        $cilindrada = null;
        $potencia = null;
        
        // Si engine es un string, usarlo como tipo de motor
        if (is_string($engineString) && !empty($engineString)) {
            $tipoMotor = $engineString;
        } elseif (is_array($engineString)) {
            // Si es un array, buscar campos dentro
            $tipoMotor = $engineString['type'] ?? $engineString['name'] ?? $engineString['configuration'] ?? null;
            $cilindrada = $engineString['displacement'] ?? $engineString['size'] ?? $engineString['capacity'] ?? null;
            $potencia = $engineString['horsepower'] ?? $engineString['power'] ?? $engineString['hp'] ?? null;
        }
        
        // También buscar engine como objeto si existe
        if (!$tipoMotor) {
            $engineObj = null;
            if (isset($apiData['engine']) && is_array($apiData['engine'])) {
                $engineObj = $apiData['engine'];
            } elseif (isset($apiData['vehicle']['engine']) && is_array($apiData['vehicle']['engine'])) {
                $engineObj = $apiData['vehicle']['engine'];
            }
            
            if ($engineObj) {
                $tipoMotor = $engineObj['type'] ?? $engineObj['name'] ?? $engineObj['configuration'] ?? $tipoMotor;
                $cilindrada = $engineObj['displacement'] ?? $engineObj['size'] ?? $engineObj['capacity'] ?? $cilindrada;
                $potencia = $engineObj['horsepower'] ?? $engineObj['power'] ?? $engineObj['hp'] ?? $potencia;
            }
        }
        
        // Obtener número de puertas - según doc es vehicle.doors
        $numPuertas = $getValue([
            'vehicle.doors',
            'doors',
            'numOfDoors',
            'vehicle.numOfDoors',
            'data.vehicle.doors',
            'data.doors'
        ], $apiData);
        
        // Obtener tipo de transmisión - según doc vehicle.transmission puede ser string
        $transmissionString = $getValue([
            'vehicle.transmission',
            'transmission',
            'transmissionType',
            'vehicle.transmissionType',
            'data.vehicle.transmission',
            'data.transmission'
        ], $apiData);
        
        $transmissionType = null;
        if (is_string($transmissionString) && !empty($transmissionString)) {
            $transmissionType = $transmissionString;
        } elseif (is_array($transmissionString) && isset($transmissionString['type'])) {
            $transmissionType = $transmissionString['type'];
        }
        
        // Obtener tipo de combustible
        // Puede venir en vehicle.fuelType o dentro de engine
        $fuelType = $getValue([
            'vehicle.fuelType',
            'fuelType',
            'vehicle.fuel',
            'fuel',
            'data.vehicle.fuelType',
            'data.fuelType'
        ], $apiData);
        
        // Mapear combustible y transmisión a IDs locales
        $idCombustible = $this->mapFuelTypeToId($fuelType);
        $idTransmision = $this->mapTransmissionTypeToId($transmissionType);
        
        return [
            'marca' => $marca,
            'modelo' => $modelo,
            'anio' => $anio ? (string)$anio : null, // Convertir a string para el formulario
            'color' => $color,
            'detalles' => $style, // Mapear style a detalles
            'pais_origen' => $paisOrigen,
            'tipo_motor' => $tipoMotor,
            'cilindrada' => $cilindrada,
            'potencia' => $potencia,
            'num_puertas' => $numPuertas ? (int)$numPuertas : null,
            'idCombustible' => $idCombustible, // ID sugerido basado en fuelType
            'idTransmision' => $idTransmision, // ID sugerido basado en transmissionType
            // Campos auxiliares
            'trim' => $trim,
            'style' => $style,
            'raw_data' => $apiData, // Guardar datos completos por si se necesitan
        ];
    }
    
    /**
     * Mapea el tipo de combustible de la API al ID de la tabla local
     *
     * @param string|null $fuelType Tipo de combustible de la API (ej: "Gasoline", "Diesel", "Electric")
     * @return int|null ID del combustible local o null si no se encuentra
     */
    protected function mapFuelTypeToId(?string $fuelType): ?int
    {
        if (empty($fuelType)) {
            return null;
        }
        
        $fuelType = strtolower(trim($fuelType));
        
        // Mapeo de tipos de combustible de la API a nuestros tipos locales
        $mapping = [
            'gasoline' => 'Nafta',
            'gas' => 'Nafta',
            'petrol' => 'Nafta',
            'diesel' => 'Diésel',
            'electric' => 'Eléctrico',
            'hybrid' => 'Eléctrico',
            'plug-in hybrid' => 'Eléctrico',
            'plug-in hybrid electric vehicle' => 'Eléctrico',
        ];
        
        // Buscar coincidencia directa o parcial
        foreach ($mapping as $apiType => $localType) {
            if (str_contains($fuelType, $apiType)) {
                $combustible = Combustible::where('tipo', $localType)->first();
                if ($combustible) {
                    return $combustible->id;
                }
            }
        }
        
        // Intentar búsqueda directa en la BD por coincidencia parcial
        $combustibles = Combustible::all();
        foreach ($combustibles as $combustible) {
            $tipoLocal = strtolower($combustible->tipo);
            if (str_contains($fuelType, $tipoLocal) || str_contains($tipoLocal, $fuelType)) {
                return $combustible->id;
            }
        }
        
        return null;
    }
    
    /**
     * Mapea el tipo de transmisión de la API al ID de la tabla local
     *
     * @param string|null $transmissionType Tipo de transmisión de la API (ej: "Automatic", "Manual")
     * @return int|null ID de la transmisión local o null si no se encuentra
     */
    protected function mapTransmissionTypeToId(?string $transmissionType): ?int
    {
        if (empty($transmissionType)) {
            return null;
        }
        
        $transmissionType = strtolower(trim($transmissionType));
        
        // Mapeo de tipos de transmisión de la API a nuestros tipos locales
        $mapping = [
            'automatic' => 'Automática',
            'auto' => 'Automática',
            'cvt' => 'Automática', // CVT se considera automática
            'manual' => 'Manual',
            'standard' => 'Manual',
        ];
        
        // Buscar coincidencia directa o parcial
        foreach ($mapping as $apiType => $localType) {
            if (str_contains($transmissionType, $apiType)) {
                $transmision = Transmision::where('tipo', $localType)->first();
                if ($transmision) {
                    return $transmision->id;
                }
            }
        }
        
        // Intentar búsqueda directa en la BD por coincidencia parcial
        $transmisiones = Transmision::all();
        foreach ($transmisiones as $transmision) {
            $tipoLocal = strtolower($transmision->tipo);
            if (str_contains($transmissionType, $tipoLocal) || str_contains($tipoLocal, $transmissionType)) {
                return $transmision->id;
            }
        }
        
        return null;
    }

    /**
     * Obtiene información OEM Build Data (información más completa)
     *
     * @param string $vin El número de identificación del vehículo
     * @return array|null Retorna los datos OEM o null si hay error
     */
    public function getOemBuildData(string $vin): ?array
    {
        if (empty($this->apiKey)) {
            return null;
        }

        try {
            // El endpoint para OEM Build Data también usa el formato /vin/{vin}
            // pero podría requerir un parámetro adicional, ajustar según la documentación
            $url = "{$this->baseUrl}/vin/{$vin}";
            
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Accept' => 'application/json',
            ])->timeout(10)->get($url);

            if ($response->successful()) {
                return $this->normalizeVehicleData($response->json());
            }

            return null;
        } catch (\Exception $e) {
            Log::error('Excepción al obtener OEM Build Data', [
                'vin' => $vin,
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }
}

