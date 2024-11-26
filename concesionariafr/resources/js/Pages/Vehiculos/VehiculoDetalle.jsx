import NavbarClient from "@/Layouts/NavbarClient";
import { Head } from "@inertiajs/react";
import React, { useState } from "react";
import Modal from "react-modal";
import Presupuesto from "@/components/Presupuesto";
import AgendarCita from "../Agenda/AgendarCita";

export default function VehiculoDetalle({ vehiculo, lineasFinanciamiento }) {
    const [modalIsOpen1, setModalIsOpen1] = useState(false);
    const [modalIsOpen2, setModalIsOpen2] = useState(false);

    const openModal1 = () => setModalIsOpen1(true);
    const closeModal1 = () => setModalIsOpen1(false);

    const openModal2 = () => setModalIsOpen2(true);
    const closeModal2 = () => setModalIsOpen2(false);

    return (
        <>
            <Head title={`${vehiculo.marca} ${vehiculo.modelo}`} />
            <NavbarClient isBlackBg={true} />

            {/* Contenedor principal */}
            <div className="mt-36 container mx-auto px-6 lg:px-12 space-y-12">
                {/* Sección superior */}
                <div className="flex flex-col lg:flex-row lg:space-x-16">
                    {/* Imagen del vehículo */}
                    <div className="w-full lg:w-2/3">
                        <img
                            src={`/storage/${vehiculo.imagenes[0]?.urlImagen || "default-image.jpg"}`}
                            alt={`${vehiculo.marca} ${vehiculo.modelo}`}
                            className="w-full h-[620px] object-cover shadow-lg"
                        />
                    </div>

                    {/* Detalle del vehículo */}
                    <div className="w-full lg:w-1/3 p-6 border border-gray-200 rounded-lg shadow-lg bg-white flex flex-col justify-between">
                        {/* Marca, modelo y precio */}
                        <div>
                            <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
                                {vehiculo.marca} {vehiculo.modelo}
                            </h1>
                            <div className="text-3xl font-semibold">
                                ${vehiculo.precio.toLocaleString()}
                            </div>
                        </div>

                        {/* Especificaciones */}
                        <div className="mt-6 space-y-4 text-gray-700 flex-1">
                            <p><strong>Año:</strong> {vehiculo.anio}</p>
                            <p><strong>Kilometraje:</strong> {vehiculo.kilometraje} km</p>
                            <p><strong>Color:</strong> {vehiculo.color}</p>
                            <p><strong>Combustible:</strong> {vehiculo.combustible}</p>
                            <p><strong>Transmisión:</strong> {vehiculo.transmision}</p>
                            <p><strong>Categoría:</strong> {vehiculo.categoria}</p>
                        </div>

                        {/* Botones */}
                        <div className="mt-4 flex flex-col sm:flex-row sm:space-x-4">
                            <button
                                onClick={openModal1}
                                className="w-full sm:w-auto bg-white text-black border border-black py-2 px-6 rounded-md hover:bg-black hover:text-white transition-all"
                            >
                                Presupuestar
                            </button>
                            <button
                                onClick={openModal2}
                                className="mt-4 sm:mt-0 w-full sm:w-auto bg-white text-black border border-black py-2 px-6 rounded-md hover:bg-black hover:text-white transition-all"
                            >
                                Agendar Cita
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para Presupuesto */}
            <Modal
                isOpen={modalIsOpen1}
                onRequestClose={closeModal1}
                contentLabel="Presupuestar"
                ariaHideApp={false}
                className="p-8 max-w-4xl mx-auto my-20 bg-white rounded-lg shadow-lg border border-gray-200"
            >
                <button
                    onClick={closeModal1}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                >
                    &times;
                </button>
                <h2 className="text-2xl font-bold mb-6">
                    {vehiculo.marca} {vehiculo.modelo}
                </h2>
                <Presupuesto vehiculo={vehiculo} lineasFinanciamiento={lineasFinanciamiento} />
            </Modal>

            {/* Modal para Agendar Cita */}
            <Modal
                isOpen={modalIsOpen2}
                onRequestClose={closeModal2}
                contentLabel="Agendar Cita"
                ariaHideApp={false}
                className="p-8 max-w-4xl mx-auto my-20 bg-white rounded-lg shadow-lg border border-gray-200"
            >
                <button
                    onClick={closeModal2}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                >
                    &times;
                </button>
                <h2 className="text-2xl font-bold mb-6">
                    Agendar Cita para {vehiculo.marca} {vehiculo.modelo}
                </h2>
                <AgendarCita vehiculo={vehiculo} closeModal={closeModal2} />
            </Modal>
        </>
    );
}
