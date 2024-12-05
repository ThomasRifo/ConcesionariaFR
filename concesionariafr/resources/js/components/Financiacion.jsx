import React, { useState, useEffect } from "react";
import VehiculoFinanciado from "@/components/VehiculoFinanciado";
import Modal from "react-modal";

export default function Financiacion({ vehiculo, lineasFinanciamiento }) {
    const [selectedLinea, setSelectedLinea] = useState(lineasFinanciamiento[0]);
    const [cuotas, setCuotas] = useState([]);
    const [capitalMaxFinanciar, setCapitalMaxFinanciar] = useState(0);
    const [montoAFinanciar, setMontoAFinanciar] = useState("");
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [cuotaSeleccionada, setCuotaSeleccionada] = useState("");

    const formatPrecio = (precio) => {
        return new Intl.NumberFormat("es-ES").format(precio);
    };

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    const handleSelectChange = (e) => {
        const selectedId = e.target.value;
        const selected = lineasFinanciamiento.find(
            (linea) => linea.id === parseInt(selectedId)
        );
        setSelectedLinea(selected);
    };

    useEffect(() => {
        if (selectedLinea) {
            setCuotas(selectedLinea.cuotas);

            // Calcular el capital máximo a financiar
            const porcentajeFinanciacion = parseFloat(
                selectedLinea.porcentaje.replace(",", ".")
            );
            if (!isNaN(porcentajeFinanciacion) && !isNaN(vehiculo.precio)) {
                const capitalFinanciado =
                    vehiculo.precio * (porcentajeFinanciacion / 100);
                const capitalMax = selectedLinea.capitalMax;

                setCapitalMaxFinanciar(
                    Math.floor(Math.min(capitalFinanciado, capitalMax))
                );
            }

            // Seleccionar automáticamente la primera cuota si hay cuotas disponibles
            if (selectedLinea.cuotas.length > 0) {
                setCuotaSeleccionada(selectedLinea.cuotas[0].numeroCuotas);
            } else {
                setCuotaSeleccionada("");
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

    const handleCuotaChange = (e) => {
        setCuotaSeleccionada(e.target.value);
    };

    return (
        <div>
            <div className="grid grid-row-2 gap-4 grid-cols-2">
                {/* Primera columna */}
                <div>
                    <label className="block text-base" htmlFor="linea-financiamiento">
                        <strong>Línea de financiación</strong>
                    </label>
                    <select
                        id="linea-financiamiento"
                        className="w-full p-2 border border-gray-300 rounded-md "
                        onChange={handleSelectChange}
                        value={selectedLinea.id}
                    >
                        {lineasFinanciamiento.map((linea) => (
                            <option key={linea.id} value={linea.id}>
                                {linea.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <div className="inline-flex text-sm flex-col ml-8 ">
                        <p className="text-gray-400">Entidad:</p>
                        <strong className="text-base">{selectedLinea.entidad}</strong>
                    </div>

                    <div className="inline-flex text-sm flex-col ml-16 mt-4">
                        <p className="text-gray-400">Capital máximo a financiar:</p>
                        <strong className="text-base">${formatPrecio(capitalMaxFinanciar)}</strong>
                    </div>
                </div>

                {/* Segunda columna */}
                
                    <div>
                        <label htmlFor="monto" className="block mt-4">
                            <strong>Monto a financiar</strong>
                        </label>
                        <input
                            id="monto"
                            type="number"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            value={montoAFinanciar}
                            onChange={handleMontoChange}
                            max={capitalMaxFinanciar}
                            step="0.01"
                        />
                    </div>
                        <div>
                    <label htmlFor="cuota" className="block mt-4">
                    <strong>Cuotas del prestamo</strong>
                    </label>
                    <select
                        id="cuota"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        onChange={handleCuotaChange}
                        value={cuotaSeleccionada}
                    >
                        {cuotas.length > 0 ? (
                            cuotas.map((cuota) => (
                                <option
                                    key={cuota.id}
                                    value={cuota.numeroCuotas}
                                >
                                    {cuota.numeroCuotas} meses
                                </option>
                            ))
                        ) : (
                            <option value="">No hay cuotas disponibles</option>
                        )}
                    </select>
                </div>
            </div>

            <div className="flex space-x-6 mt-12 flex-col sm:flex-row  ">
                <button
                    onClick={openModal}
                    className="mt-8 sm:mt-0 w-full sm:w-auto bg-white text-black border border-black py-2 px-6 rounded-md hover:bg-black hover:text-white transition-all m-auto"
                >
                    Calcular financiamiento
                </button>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Financiación"
                ariaHideApp={false}
                className="p-8 max-w-3xl mx-auto my-64 border-gray-400 border-2 bg-white"
            >
                <VehiculoFinanciado
                    monto={montoAFinanciar}
                    cuotas={cuotaSeleccionada || 0}
                    tasa={selectedLinea.TNA}
                    lineaFinanciamiento={selectedLinea}
                    vehiculo={vehiculo}
                    onClose={closeModal}
                />
            </Modal>
        </div>
    );
}
