import React, { useState } from "react";
import Modal from "react-modal";
import Financiacion from "@/components/Financiacion";

export default function Presupuesto({ vehiculo, lineasFinanciamiento }) {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);
    const formatPrecio = (precio) => {
        return new Intl.NumberFormat("es-ES").format(precio);
    };

    return (
        <>
            <div>
                <h2 className="text-2xl font-bold mt-2">
                    {vehiculo.marca} {vehiculo.modelo}
                </h2>
                <p>
                    {" "}
                    {vehiculo.anio} | Usado | {vehiculo.combustible} |{" "}
                    {vehiculo.transmision}{" "}
                </p>

                <p className="mt-4  text-lg flex justify-between px-6">
                    Precio del vehículo:
                    <strong className="text-xl">{`$ ${formatPrecio(
                        vehiculo.precio
                    )}`}</strong>
                </p>

                <p className="mt-4  text-lg flex justify-between px-6">
                    Gastos de entrega
                    <strong className="text-xl">{`$ ${formatPrecio(
                        vehiculo.precio*0.04
                    )}`}</strong>
                </p>

                <p className="mt-4  text-lg flex justify-between px-6">
                    Saldo a cancelar
                    <strong className="text-2xl">{`$ ${formatPrecio(
                        vehiculo.precio*1.04
                    )}`}</strong>
                </p>

                <div className="flex space-x-6 mt-12 flex-col sm:flex-row  ">
                    <button
                        onClick={openModal}
                        className="mt-8 sm:mt-0 w-full sm:w-auto bg-white text-black border border-black py-2 px-6 rounded-md hover:bg-black hover:text-white transition-all m-auto"
                    >
                        <strong className="text-lg">¿Querés financiar?</strong>
                    </button>
                </div>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Financiación"
                ariaHideApp={false}
                className="p-8 max-w-4xl mx-auto my-64 border-gray-400 border-2 bg-white"
            >
                <h2 className="text-2xl font-bold mb-4">
                    Elegí tu línea financiera
                </h2>

                <Financiacion
                    vehiculo={vehiculo}
                    lineasFinanciamiento={lineasFinanciamiento}
                />

                <button
                    onClick={closeModal}
                    className="flex items-center text-blue-600 hover:text-blue-700 mt-4"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                    Volver
                </button>
            </Modal>
        </>
    );
}
