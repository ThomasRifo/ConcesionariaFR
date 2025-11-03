<?php

namespace App\Services;

use SoapClient;
use SoapFault;
use Exception;
use Illuminate\Support\Facades\Log;

/**
 * Servicio SOAP para Laravel
 * 
 * Esta clase proporciona una interfaz simple y flexible para trabajar con servicios SOAP.
 * 
 * Ejemplo de uso:
 * 
 * // Inicializar el servicio
 * $soapService = new SoapService();
 * 
 * // Llamar a un método SOAP
 * $result = $soapService->call('MetodoEjemplo', [
 *     'parametro1' => 'valor1',
 *     'parametro2' => 'valor2'
 * ]);
 * 
 * // Con autenticación
 * $soapService->setAuth('usuario', 'contraseña');
 * $result = $soapService->call('MetodoProtegido', $params);
 * 
 * // Agregar headers personalizados
 * $soapService->addHeader('HeaderName', 'HeaderValue');
 * $result = $soapService->call('MetodoConHeader', $params);
 */
class SoapService
{
    protected $client;
    protected $wsdl;
    protected $location;
    protected $uri;
    protected $options;
    protected $headers = [];
    protected $auth = [];

    /**
     * Constructor del servicio SOAP
     * 
     * @param string|null $wsdl URL del archivo WSDL (opcional, se usa config/services.php por defecto)
     * @param array $options Opciones adicionales para SoapClient
     */
    public function __construct($wsdl = null, array $options = [])
    {
        $config = config('services.soap');
        
        $this->wsdl = $wsdl ?? $config['wsdl'];
        $this->location = $config['location'];
        $this->uri = $config['uri'];
        $this->options = array_merge($config['options'], $options);
        $this->headers = $config['headers'] ?? [];
        
        // Configurar autenticación si está disponible
        if (!empty($config['auth']['username']) && !empty($config['auth']['password'])) {
            $this->setAuth($config['auth']['username'], $config['auth']['password']);
        }

        $this->initializeClient();
    }

    /**
     * Inicializa el cliente SOAP
     */
    protected function initializeClient()
    {
        try {
            $options = $this->buildOptions();
            
            // Agregar timeouts si no están configurados
            if (!isset($options['connection_timeout'])) {
                $options['connection_timeout'] = 10;
            }
            if (!isset($options['default_socket_timeout'])) {
                $options['default_socket_timeout'] = 10;
            }
            
            // Establecer timeout de PHP para la inicialización
            set_time_limit(15); // 15 segundos máximo para inicializar
            
            if ($this->wsdl) {
                $this->client = @new SoapClient($this->wsdl, $options);
            } elseif ($this->location && $this->uri) {
                $this->client = @new SoapClient(null, array_merge($options, [
                    'location' => $this->location,
                    'uri' => $this->uri,
                ]));
            } else {
                throw new Exception('Se debe proporcionar WSDL o location/uri para el servicio SOAP');
            }
        } catch (SoapFault $e) {
            Log::error('Error al inicializar cliente SOAP: ' . $e->getMessage());
            throw new Exception('Error al inicializar el servicio SOAP: ' . $e->getMessage());
        } catch (\Exception $e) {
            Log::error('Error general al inicializar cliente SOAP: ' . $e->getMessage());
            throw new Exception('Error al inicializar el servicio SOAP: ' . $e->getMessage());
        }
    }

    /**
     * Construye las opciones para SoapClient
     */
    protected function buildOptions()
    {
        $options = $this->options;

        // Agregar autenticación si está configurada
        if (!empty($this->auth)) {
            $options['authentication'] = SOAP_AUTHENTICATION_BASIC;
            $options['login'] = $this->auth['username'];
            $options['password'] = $this->auth['password'];
        }

        return $options;
    }

    /**
     * Establece las credenciales de autenticación
     * 
     * @param string $username
     * @param string $password
     * @return self
     */
    public function setAuth($username, $password)
    {
        $this->auth = [
            'username' => $username,
            'password' => $password,
        ];

        // Reinicializar el cliente con las nuevas credenciales
        $this->initializeClient();

        return $this;
    }

    /**
     * Agrega un header SOAP personalizado
     * 
     * @param string $namespace Namespace del header
     * @param string $name Nombre del header
     * @param mixed $data Datos del header
     * @return self
     */
    public function addHeader($namespace, $name, $data = null)
    {
        if ($data === null) {
            $this->headers[] = new \SoapHeader($namespace, $name);
        } else {
            $this->headers[] = new \SoapHeader($namespace, $name, $data);
        }

        return $this;
    }

    /**
     * Limpia todos los headers personalizados
     * 
     * @return self
     */
    public function clearHeaders()
    {
        $this->headers = [];
        return $this;
    }

    /**
     * Llama a un método del servicio SOAP
     * 
     * @param string $method Nombre del método a llamar
     * @param array $params Parámetros del método
     * @param array $options Opciones adicionales para la llamada
     * @return mixed Resultado de la llamada SOAP
     * @throws Exception
     */
    public function call($method, array $params = [], array $options = [])
    {
        try {
            if (empty($this->headers)) {
                $result = $this->client->__soapCall($method, [$params], $options);
            } else {
                $result = $this->client->__soapCall($method, [$params], $options, $this->headers);
            }

            Log::info("Llamada SOAP exitosa: {$method}", ['params' => $params]);

            return $result;
        } catch (SoapFault $e) {
            Log::error("Error en llamada SOAP: {$method}", [
                'params' => $params,
                'error' => $e->getMessage(),
                'faultcode' => $e->faultcode ?? null,
                'faultstring' => $e->faultstring ?? null,
            ]);

            throw new Exception(
                "Error en la llamada SOAP '{$method}': {$e->getMessage()}",
                0,
                $e
            );
        }
    }

    /**
     * Obtiene la última petición SOAP (útil para debugging)
     * 
     * @return string
     */
    public function getLastRequest()
    {
        return $this->client->__getLastRequest();
    }

    /**
     * Obtiene la última respuesta SOAP (útil para debugging)
     * 
     * @return string
     */
    public function getLastResponse()
    {
        return $this->client->__getLastResponse();
    }

    /**
     * Obtiene los headers de la última petición (útil para debugging)
     * 
     * @return string
     */
    public function getLastRequestHeaders()
    {
        return $this->client->__getLastRequestHeaders();
    }

    /**
     * Obtiene los headers de la última respuesta (útil para debugging)
     * 
     * @return string
     */
    public function getLastResponseHeaders()
    {
        return $this->client->__getLastResponseHeaders();
    }

    /**
     * Obtiene las funciones disponibles en el servicio SOAP
     * 
     * @return array
     */
    public function getFunctions()
    {
        try {
            return $this->client->__getFunctions();
        } catch (SoapFault $e) {
            Log::error('Error al obtener funciones SOAP: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Obtiene los tipos disponibles en el servicio SOAP
     * 
     * @return array
     */
    public function getTypes()
    {
        try {
            return $this->client->__getTypes();
        } catch (SoapFault $e) {
            Log::error('Error al obtener tipos SOAP: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Obtiene el cliente SOAP directamente (para casos avanzados)
     * 
     * @return SoapClient
     */
    public function getClient()
    {
        return $this->client;
    }
}

