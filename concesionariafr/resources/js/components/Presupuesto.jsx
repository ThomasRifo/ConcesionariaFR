import React, { useState } from 'react';
import Modal from 'react-modal';
import Financiacion from "@/components/Financiacion";

export default function Presupuesto({ vehiculo }) {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    return (
        <>
            <div>
                <p><strong>Precio del vehículo: $ </strong>{vehiculo.precio}</p>
                <p><strong>Saldo a cancelar: $ </strong>{vehiculo.precio}</p>

                <div className="flex space-x-4">
                    <button 
                        onClick={openModal} 
                        className="mt-4 bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-600 hover:text-white py-2 px-4 w-full rounded-md"
                    >
                        ¿Querés financiar?
                    </button>
                </div>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Financiación"
                ariaHideApp={false}
                className="p-8 max-w-4xl mx-auto my-32 border-gray-400 border-2 bg-white"
            >
                <h2 className="text-2xl font-bold mb-4">Elegí tu línea financiera</h2>

                <Financiacion vehiculo={vehiculo} />

                <button 
                    onClick={closeModal} 
                    className="flex items-center text-blue-600 hover:text-blue-700 mt-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                    Volver
                </button>
            </Modal>
        </>
    );
}
