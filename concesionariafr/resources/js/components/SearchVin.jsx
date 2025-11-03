import React, { useState } from 'react';
import axios from 'axios';
import TextInput from '@/Components/TextInput';

const SearchVin = ({ vin, onVinChange, onDataReceived }) => {
    const [loading, setLoading] = useState(false);
    const [vinError, setVinError] = useState('');
    const [vinSuccess, setVinSuccess] = useState('');

    const buscarPorVin = async () => {
        const vinValue = vin.trim().toUpperCase();
        
        if (!vinValue || vinValue.length < 17) {
            setVinError('El VIN debe tener 17 caracteres');
            return;
        }

        setLoading(true);
        setVinError('');
        setVinSuccess('');

        try {
            const response = await axios.post(route('vehiculos.buscar-vin'), {
                vin: vinValue,
            });

            if (response.data.success && response.data.data) {
                const vehiculoData = response.data.data;
                
                console.log('Datos recibidos de la API:', vehiculoData);
                console.log('Raw data completo:', vehiculoData.raw_data);
                
                let camposCompletados = [];
                
                // Auto-completar marca primero
                if (vehiculoData.marca) {
                    onDataReceived((prevData) => ({
                        ...prevData,
                        marca: vehiculoData.marca
                    }));
                    camposCompletados.push('marca');
                    console.log('✓ Marca completada:', vehiculoData.marca);
                }
                
                // Preparar actualizaciones para todos los demás campos
                const updates = {};
                
                if (vehiculoData.modelo) {
                    updates.modelo = vehiculoData.modelo;
                    camposCompletados.push('modelo');
                }
                
                if (vehiculoData.anio) {
                    updates.anio = String(vehiculoData.anio);
                    camposCompletados.push('año');
                }
                
                if (vehiculoData.color) {
                    updates.color = vehiculoData.color;
                    camposCompletados.push('color');
                }
                
                // Autocompletar nuevos campos de Auto.dev
                if (vehiculoData.detalles) {
                    updates.detalles = vehiculoData.detalles;
                    camposCompletados.push('detalles');
                }
                
                if (vehiculoData.pais_origen) {
                    updates.pais_origen = vehiculoData.pais_origen;
                    camposCompletados.push('país de origen');
                }
                
                if (vehiculoData.tipo_motor) {
                    updates.tipo_motor = vehiculoData.tipo_motor;
                    camposCompletados.push('tipo de motor');
                }
                
                if (vehiculoData.cilindrada) {
                    updates.cilindrada = vehiculoData.cilindrada;
                    camposCompletados.push('cilindrada');
                }
                
                if (vehiculoData.potencia) {
                    updates.potencia = vehiculoData.potencia;
                    camposCompletados.push('potencia');
                }
                
                if (vehiculoData.num_puertas) {
                    updates.num_puertas = String(vehiculoData.num_puertas);
                    camposCompletados.push('número de puertas');
                }
                
                // Autoseleccionar combustible y transmisión si vienen sugeridos
                if (vehiculoData.idCombustible) {
                    updates.idCombustible = vehiculoData.idCombustible;
                    camposCompletados.push('combustible');
                }
                
                if (vehiculoData.idTransmision) {
                    updates.idTransmision = vehiculoData.idTransmision;
                    camposCompletados.push('transmisión');
                }
                
                // Actualizar todos los campos en una sola llamada
                if (Object.keys(updates).length > 0) {
                    onDataReceived((prevData) => ({
                        ...prevData,
                        ...updates
                    }));
                }
                
                // Mostrar mensaje de éxito con advertencia si faltan campos importantes
                if (camposCompletados.length > 0) {
                    let mensaje = `✓ Información encontrada. Campos completados: ${camposCompletados.join(', ')}.`;
                    
                    // Advertir si faltan campos importantes
                    const camposFaltantes = [];
                    if (!vehiculoData.modelo) camposFaltantes.push('modelo');
                    if (!vehiculoData.color) camposFaltantes.push('color');
                    
                    if (camposFaltantes.length > 0) {
                        mensaje += ` Por favor, complete manualmente: ${camposFaltantes.join(', ')}.`;
                    }
                    
                    setVinSuccess(mensaje);
                } else {
                    setVinError('Se encontró información del VIN pero no se pudo completar ningún campo automáticamente. Este VIN puede tener información limitada en la base de datos de la API.');
                }
            } else {
                const errorMsg = response.data?.message || 'No se pudo obtener información del vehículo. Verifique el VIN.';
                setVinError(errorMsg);
                console.error('Error en respuesta:', response.data);
            }
        } catch (error) {
            console.error('Error al buscar VIN:', error);
            console.error('Detalles del error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            
            let errorMessage = 'Error al buscar información del vehículo';
            
            if (error.response) {
                errorMessage = error.response.data?.message 
                    || error.response.data?.error 
                    || `Error ${error.response.status}: ${error.response.statusText}`;
                    
                if (error.response.data?.details) {
                    console.error('Detalles del error:', error.response.data.details);
                }
            } else if (error.request) {
                errorMessage = 'No se recibió respuesta del servidor. Verifique su conexión.';
            } else {
                errorMessage = `Error: ${error.message}`;
            }
            
            setVinError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleVinChange = (e) => {
        const newVin = e.target.value.toUpperCase();
        onVinChange(newVin);
        setVinError('');
        setVinSuccess('');
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">
                VIN (Número de Identificación del Vehículo)
            </label>
            <div className="mt-2 flex gap-2">
                <TextInput
                    value={vin}
                    onChange={handleVinChange}
                    placeholder="Ingrese el VIN (17 caracteres)"
                    maxLength={17}
                    className="flex-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                    type="button"
                    onClick={buscarPorVin}
                    disabled={loading || !vin || vin.length !== 17}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring focus:ring-indigo-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {loading ? 'Buscando...' : 'Buscar'}
                </button>
            </div>
            {vinError && <span className="text-red-500 text-sm mt-1 block">{vinError}</span>}
            {vinSuccess && <span className="text-green-600 text-sm mt-1 block">{vinSuccess}</span>}
            <p className="text-xs text-gray-500 mt-1">
                Ingrese el VIN de 17 caracteres y haga clic en "Buscar" para auto-completar los datos del vehículo.
            </p>
        </div>
    );
};

export default SearchVin;


