import React, { useState } from "react";
import axios from "axios";
import Modal from "react-modal";

export default function FinanciamientoBanco({ vehiculo }) {
    const [loading, setLoading] = useState(false);
    const [opciones, setOpciones] = useState(null);
    const [error, setError] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [enganche, setEnganche] = useState("");
    const [plazoMaximo, setPlazoMaximo] = useState(60);

    const formatPrecio = (precio) => {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            maximumFractionDigits: 0,
        }).format(precio);
    };

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => {
        setModalIsOpen(false);
        setOpciones(null);
        setError(null);
    };

    const consultarBanco = async () => {
        if (!vehiculo || !vehiculo.id) {
            setError("Vehículo no válido");
            return;
        }

        setLoading(true);
        setError(null);
        setOpciones(null);

        try {
            // Si el usuario ingresó un monto a financiar, calcular el enganche
            const precioVehiculo = vehiculo.precio || 0;
            const montoAFinanciar = parseFloat(enganche) || 0;
            const engancheCalculado = montoAFinanciar > 0 && montoAFinanciar < precioVehiculo 
                ? precioVehiculo - montoAFinanciar 
                : 0;

            const response = await axios.post("/banco/consultar-financiamiento", {
                vehiculo_id: vehiculo.id,
                enganche: engancheCalculado,
                plazo_maximo: parseInt(plazoMaximo) || 60,
            });

            if (response.data.success) {
                setOpciones(response.data.financiamiento);
            } else {
                setError(response.data.message || "Error al consultar el banco");
            }
        } catch (err) {
            console.error("Error:", err);
            setError(
                err.response?.data?.message ||
                    "Error al conectar con el servicio bancario. Por favor, intenta nuevamente."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button
                onClick={openModal}
                className="w-full sm:w-auto bg-blue-600 text-white border border-blue-600 py-2 px-6 rounded-md hover:bg-blue-700 hover:border-blue-700 transition-all"
            >
                Consultar Financiamiento Banco
            </button>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Financiamiento Banco"
                ariaHideApp={false}
                className="p-8 max-w-4xl mx-auto my-16 bg-white rounded-lg shadow-lg border border-gray-200 overflow-y-auto max-h-[90vh]"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Financiamiento desde Banco
                    </h2>
                    <button
                        onClick={closeModal}
                        className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
                    >
                        &times;
                    </button>
                </div>

                {/* Información del vehículo */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="font-semibold text-lg mb-2">
                        {vehiculo?.marca} {vehiculo?.modelo} ({vehiculo?.anio})
                    </h3>
                    <p className="text-gray-700">
                        Precio: <strong>{formatPrecio(vehiculo?.precio || 0)}</strong>
                    </p>
                </div>

                {/* Formulario de consulta */}
                {!opciones && (
                    <div className="space-y-4 mb-6">
                        <div>
                            <label
                                htmlFor="enganche"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Monto a financiar (opcional)
                            </label>
                            <input
                                id="enganche"
                                type="number"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={enganche}
                                onChange={(e) => setEnganche(e.target.value)}
                                placeholder="Ej: 450000"
                                min="0"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="plazo"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Plazo máximo (meses)
                            </label>
                            <select
                                id="plazo"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={plazoMaximo}
                                onChange={(e) => setPlazoMaximo(e.target.value)}
                            >
                                <option value="12">12 meses</option>
                                <option value="24">24 meses</option>
                                <option value="36">36 meses</option>
                                <option value="48">48 meses</option>
                                <option value="60">60 meses</option>
                            </select>
                        </div>

                        <button
                            onClick={consultarBanco}
                            disabled={loading}
                            className={`w-full py-3 px-6 rounded-md font-semibold transition-all ${
                                loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                        >
                            {loading ? "Consultando..." : "Consultar Opciones"}
                        </button>
                    </div>
                )}

                {/* Mensaje de error */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        <p className="font-semibold">Error</p>
                        <p>{error}</p>
                    </div>
                )}

                {/* Resultados */}
                {opciones && (
                    <div className="space-y-6">
                        {/* Resumen general */}
                        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                            <h3 className="font-semibold text-lg text-green-800 mb-3">
                                Resumen de la Consulta
                            </h3>
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                                <div>
                                    <span className="font-medium">Precio vehículo:</span>{" "}
                                    {formatPrecio(opciones.precioVehiculo || 0)}
                                </div>
                                {opciones.enganche > 0 && (
                                    <div>
                                        <span className="font-medium">Enganche:</span>{" "}
                                        {formatPrecio(opciones.precioVehiculo - (opciones.montoFinanciar || opciones.precioVehiculo))}
                                    </div>
                                )}
                                <div className="col-span-2">
                                    <span className="font-medium">Monto a financiar:</span>{" "}
                                    <strong className="text-lg">
                                        {formatPrecio(opciones.montoFinanciar || opciones.precioVehiculo || 0)}
                                    </strong>
                                </div>
                                {opciones.totalBancos && (
                                    <div className="col-span-2">
                                        <span className="font-medium">Bancos disponibles:</span>{" "}
                                        <strong>{opciones.totalBancos}</strong>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mostrar múltiples bancos si existen */}
                        {opciones.bancos && opciones.bancos.length > 0 ? (
                            opciones.bancos.map((banco, bancoIndex) => (
                                <div key={bancoIndex} className="border border-gray-300 rounded-lg p-6 bg-white">
                                    <h3 className="text-xl font-bold mb-4 text-blue-700 border-b-2 border-blue-200 pb-2">
                                        {banco.banco}
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {banco.opciones.map((opcion, index) => (
                                            <div
                                                key={index}
                                                className="border border-gray-300 rounded-lg p-4 hover:shadow-lg transition-shadow bg-gray-50"
                                            >
                                                {opcion.linea_nombre && (
                                                    <p className="text-xs text-gray-500 mb-2 italic">
                                                        {opcion.linea_nombre}
                                                    </p>
                                                )}
                                                <div className="flex justify-between items-center mb-3">
                                                    <h4 className="text-lg font-bold text-blue-600">
                                                        {opcion.plazo} meses
                                                    </h4>
                                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                        CFT: {opcion.cft}%
                                                    </span>
                                                </div>

                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Cuota mensual:</span>
                                                        <strong className="text-lg text-gray-800">
                                                            {formatPrecio(opcion.montoCuota)}
                                                        </strong>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Tasa interés (TNA):</span>
                                                        <span>{opcion.tasaInteres}%</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Total a pagar:</span>
                                                        <span className="font-semibold">
                                                            {formatPrecio(opcion.totalPagar)}
                                                        </span>
                                                    </div>
                                                    {opcion.interesesTotal && (
                                                        <div className="flex justify-between pt-2 border-t border-gray-200">
                                                            <span className="text-gray-500 text-xs">Intereses total:</span>
                                                            <span className="text-xs text-gray-600">
                                                                {formatPrecio(opcion.interesesTotal)}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            // Formato antiguo para retrocompatibilidad
                            opciones.opciones && (
                                <>
                                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                                        <h3 className="font-semibold text-lg text-green-800 mb-2">
                                            {opciones.banco || 'Banco'}
                                        </h3>
                                    </div>
                                    <h3 className="text-xl font-bold mt-6 mb-4">Opciones de Financiamiento</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {opciones.opciones.map((opcion, index) => (
                                            <div
                                                key={index}
                                                className="border border-gray-300 rounded-lg p-4 hover:shadow-lg transition-shadow"
                                            >
                                                <div className="flex justify-between items-center mb-3">
                                                    <h4 className="text-lg font-bold text-blue-600">
                                                        {opcion.plazo} meses
                                                    </h4>
                                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                        CFT: {opcion.cft}%
                                                    </span>
                                                </div>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Cuota mensual:</span>
                                                        <strong className="text-lg text-gray-800">
                                                            {formatPrecio(opcion.montoCuota)}
                                                        </strong>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Tasa interés:</span>
                                                        <span>{opcion.tasaInteres}%</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Total a pagar:</span>
                                                        <span className="font-semibold">
                                                            {formatPrecio(opcion.totalPagar)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )
                        )}

                        {opciones.fechaConsulta && (
                            <div className="text-xs text-gray-500 text-center pt-4 border-t border-gray-200">
                                Consultado el: {new Date(opciones.fechaConsulta).toLocaleString('es-AR')}
                            </div>
                        )}

                        <div className="mt-6 flex space-x-4">
                            <button
                                onClick={() => {
                                    setOpciones(null);
                                    setError(null);
                                }}
                                className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-all"
                            >
                                Nueva Consulta
                            </button>
                            <button
                                onClick={closeModal}
                                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

