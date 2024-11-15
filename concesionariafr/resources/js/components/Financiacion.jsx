import React, { useState, useEffect } from 'react';
import VehiculoFinanciado from "@/components/VehiculoFinanciado";
import Modal from 'react-modal';

export default function Financiacion({ vehiculo, lineasFinanciamiento }) {
    const [selectedLinea, setSelectedLinea] = useState(lineasFinanciamiento[0]);
    const [cuotas, setCuotas] = useState([]); // Estado para las cuotas
    const [capitalMaxFinanciar, setCapitalMaxFinanciar] = useState(0);
    const [montoAFinanciar, setMontoAFinanciar] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [cuotaSeleccionada, setCuotaSeleccionada] = useState(''); // Nuevo estado para la cuota seleccionada

    const formatPrecio = (precio) => {
        return new Intl.NumberFormat('es-ES').format(precio);
    };

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);
    

    // Esta función actualiza las cuotas y el capital máximo a financiar cada vez que se cambia la línea de financiamiento
    const handleSelectChange = (e) => {
        const selectedId = e.target.value;
        const selected = lineasFinanciamiento.find(linea => linea.id === parseInt(selectedId));
        setSelectedLinea(selected);  // Cambiar la línea seleccionada
        setCuotaSeleccionada(''); // Resetear la cuota seleccionada al cambiar la línea
    };

    useEffect(() => {
        // Al cambiar la línea de financiamiento, actualizamos las cuotas
        if (selectedLinea) {
            setCuotas(selectedLinea.cuotas);
            const porcentajeFinanciacion = parseFloat(selectedLinea.porcentaje.replace(',', '.'));
            if (!isNaN(porcentajeFinanciacion) && !isNaN(vehiculo.precio)) {
                const capitalFinanciado = vehiculo.precio * (porcentajeFinanciacion / 100);
                const capitalMax = selectedLinea.capitalMax;

                setCapitalMaxFinanciar(Math.floor(Math.min(capitalFinanciado, capitalMax)));
            }
        }
    }, [selectedLinea, vehiculo]);

    const handleMontoChange = (e) => {
        let value = e.target.value;

        if (value > capitalMaxFinanciar) {
            value = capitalMaxFinanciar;
        }
        setMontoAFinanciar(value);
    };

    // Función para manejar el cambio de la cuota seleccionada
    const handleCuotaChange = (e) => {
        setCuotaSeleccionada(e.target.value);
    };

    return (
        <div>
            <ul>
                <li>
                    <label htmlFor="linea-financiamiento">Línea de financiación</label>
                    <select
                        id="linea-financiamiento"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        onChange={handleSelectChange}
                        value={selectedLinea.id}
                    >
                        {lineasFinanciamiento.map((linea) => (
                            <option key={linea.id} value={linea.id}>
                                {linea.nombre}
                            </option>
                        ))}
                    </select>
                </li>
                <li>Entidad: {selectedLinea.entidad}</li>
                <li>Capital máximo a financiar: ${formatPrecio(capitalMaxFinanciar)}</li>
                <li>
                    <label htmlFor="monto">Monto a financiar</label>
                    <input
                        id="monto"
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={montoAFinanciar}
                        onChange={handleMontoChange}
                        max={capitalMaxFinanciar}
                        step="0.01"
                    />
                </li>

                <li>
                    <label htmlFor="cuota">Cuotas disponibles</label>
                    <select
                        id="cuota"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        onChange={handleCuotaChange} // Manejar cambio de cuota
                        value={cuotaSeleccionada} // Usar el estado cuotaSeleccionada
                    >
                        {cuotas.length > 0 ? (
                            cuotas.map((cuota) => (
                                <option key={cuota.id} value={cuota.numeroCuotas}>
                                    {cuota.numeroCuotas} meses
                                </option>
                            ))
                        ) : (
                            <option value="">No hay cuotas disponibles</option>
                        )}
                    </select>
                </li>
            </ul>
            <button 
                onClick={openModal}
                className="mt-4 p-2 bg-blue-500 text-white rounded-md"
            >
                Calcular financiamiento
            </button>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Financiación"
                ariaHideApp={false}
                className="p-8 max-w-4xl mx-auto my-32 border-gray-400 border-2 bg-white"
            >
                <VehiculoFinanciado
                    monto={montoAFinanciar}
                    cuotas={cuotaSeleccionada || 0} // Usar la cuota seleccionada
                    tasa={selectedLinea.TNA}
                    lineaFinanciamiento={selectedLinea} // Pasamos la línea completa
                    vehiculo={vehiculo}
                    onClose={closeModal}
                />
            </Modal>
        </div>
    );
}
