import NavbarClient from "@/Layouts/NavbarClient";
import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import Modal from 'react-modal';
import Presupuesto from "@/components/Presupuesto";

export default function VehiculoDetalle({ vehiculo }) {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    return (
        <>
            <Head title="Vehículo Detalle" />
            {/* Pasamos true a isBlackBg para que siempre tenga el fondo negro */}
            <NavbarClient isBlackBg={true} />

            <div className="mt-20">
                <h1 className="text-center text-xl font-bold mb-4">Detalles del Vehículo</h1>
                
                <div className="vehiculo-info">
                    <p><strong>Marca:</strong> {vehiculo.marca}</p>
                    <p><strong>Modelo:</strong> {vehiculo.modelo}</p>
                    <p><strong>Año:</strong> {vehiculo.anio}</p>
                    <p><strong>Kilometraje:</strong> {vehiculo.kilometraje} km</p>

                    <button
                        onClick={openModal}
                        className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                    >
                        Presupuestar
                    </button>
                </div>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Presupuestar"
                ariaHideApp={false}
                className="p-8 max-w-4xl mx-auto my-32 border-gray-400 border-2 bg-white relative"
            >
                <button 
                    onClick={closeModal}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                >
                    &times;
                </button>

                <h2 className="text-2xl font-bold mb-4">{vehiculo.marca} {vehiculo.modelo}</h2>

                <Presupuesto vehiculo={vehiculo} />
            </Modal>
        </>
    );
}
