import React, { useState, useEffect } from 'react';
import VehiculoFinanciado from "@/components/VehiculoFinanciado";
import Modal from 'react-modal';

export default function Financiacion({ vehiculo, lineasFinanciamiento }) {
    const [selectedLinea, setSelectedLinea] = useState(lineasFinanciamiento[0]);
    const [cuotas, setCuotas] = useState([]);
    const [capitalMaxFinanciar, setCapitalMaxFinanciar] = useState(0);
    const [montoAFinanciar, setMontoAFinanciar] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    const handleSelectChange = (e) => {
        const selectedId = e.target.value;
        const selected = lineasFinanciamiento.find(linea => linea.id === parseInt(selectedId));
        setSelectedLinea(selected);
        setCuotas(selected.cuotas);
    };

    useEffect(() => {
        if (vehiculo && selectedLinea) {
            const porcentajeFinanciacion = parseFloat(selectedLinea.porcentaje.replace(',', '.'));
            if (!isNaN(porcentajeFinanciacion) && !isNaN(vehiculo.precio)) {
                const capitalFinanciado = vehiculo.precio * (porcentajeFinanciacion / 100);
                const capitalMax = selectedLinea.capitalMax;

                setCapitalMaxFinanciar(Math.floor(Math.min(capitalFinanciado, capitalMax)));
                setCuotas(selectedLinea.cuotas);
            }
        }
    }, [vehiculo, selectedLinea]);

    const handleMontoChange = (e) => {
        let value = e.target.value;

        if (value > capitalMaxFinanciar) {
            value = capitalMaxFinanciar;
        }
        setMontoAFinanciar(value);
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
                <li>Capital máximo a financiar: ${capitalMaxFinanciar}</li>
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
                    cuotas={cuotas[0]?.numeroCuotas || 0} 
                    tasa={selectedLinea.TNA}
                    onClose={() => setShowModal(false)}
                />
            </Modal>
        </div>
    );
}
