import NavbarClient from "@/Layouts/NavbarClient";
import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import Modal from 'react-modal';
import Presupuesto from "@/components/Presupuesto";
import AgendarCita from "../Agenda/AgendarCita";

export default function VehiculoDetalle({ vehiculo, lineasFinanciamiento }) {
    const [modalIsOpen1, setModalIsOpen1] = useState(false);
    const [modalIsOpen2, setModalIsOpen2] = useState(false);
    const [selectedVehiculo, setSelectedVehiculo] = useState(null);

    const openModal1 = () => setModalIsOpen1(true);
    const closeModal1 = () => setModalIsOpen1(false);

    const openModal2 = (vehiculo) => {
        setSelectedVehiculo(vehiculo);
        setModalIsOpen2(true);
    };

    const closeModal2 = () => {
        setModalIsOpen2(false);
        setSelectedVehiculo(null);
    };

    return (
        <>
            <Head title="Vehículo Detalle" />
            <NavbarClient isBlackBg={true} />

            <div className="mt-24">
                <h1 className="text-center text-xl font-bold mb-4">Detalles del Vehículo</h1>
                
                <div className="vehiculo-info">
                    <p><strong>Marca:</strong> {vehiculo.marca}</p>
                    <p><strong>Modelo:</strong> {vehiculo.modelo}</p>
                    <p><strong>Año:</strong> {vehiculo.anio}</p>
                    <p><strong>Kilometraje:</strong> {vehiculo.kilometraje} km</p>

                    <button
                        onClick={openModal1}
                        className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                    >
                        Presupuestar
                    </button>
                    <button 
                        className="mt-3 bg-[#800000] text-white py-2 px-4 rounded-md w-full hover:bg-red-700" 
                        onClick={() => openModal2(vehiculo)}
                    >
                        Agendar Cita
                    </button>
                </div>
            </div>

            {/* Modal para Presupuesto */}
            <Modal
                isOpen={modalIsOpen1}
                onRequestClose={closeModal1}
                contentLabel="Presupuestar"
                ariaHideApp={false}
                className="p-8 max-w-4xl mx-auto my-32 border-gray-400 border-2 bg-white relative"
            >
                <button 
                    onClick={closeModal1}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                >
                    &times;
                </button>

                <h2 className="text-2xl font-bold mb-4">{vehiculo.marca} {vehiculo.modelo}</h2>
                <Presupuesto vehiculo={vehiculo} lineasFinanciamiento={lineasFinanciamiento} />
            </Modal>

            {/* Modal para Agendar Cita */}
            <Modal 
                isOpen={modalIsOpen2} 
                onRequestClose={closeModal2} 
                contentLabel="Agendar Cita"
                ariaHideApp={false}
                className="p-8 max-w-4xl mx-auto my-32 border-gray-400 border-2 bg-white relative"
            >
                <button 
                    onClick={closeModal2}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                >
                    &times;
                </button>

                <AgendarCita vehiculo={vehiculo} closeModal={closeModal2} />
            </Modal>
        </>
    );
}
