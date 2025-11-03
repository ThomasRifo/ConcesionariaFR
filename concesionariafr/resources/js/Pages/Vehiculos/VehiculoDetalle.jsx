import NavbarClient from "@/Layouts/NavbarClient";
import React, { useState, useEffect } from "react";
import { Head, usePage, Link } from "@inertiajs/react";
import Modal from "react-modal";
import Presupuesto from "@/components/Presupuesto";
import AgendarCita from "../Agenda/AgendarCita";
import Pusher from 'pusher-js';
import Footer from "@/Layouts/Footer";
import GoogleMap from "@/components/GoogleMap";
export default function VehiculoDetalle({ vehiculo, lineasFinanciamiento, favoritos }) {



    const [modalIsOpen1, setModalIsOpen1] = useState(false);
    const [modalIsOpen2, setModalIsOpen2] = useState(false);
    const [favoriteVehiculos, setFavoriteVehiculos] = useState(favoritos); 

    const openModal1 = () => setModalIsOpen1(true);
    const closeModal1 = () => setModalIsOpen1(false);

    const openModal2 = () => setModalIsOpen2(true);
    const closeModal2 = () => setModalIsOpen2(false);


    const { user } = usePage().props.auth;

    const handleAddToFavorites = (vehiculoId) => {
        axios
            .post(route("favoritos.add"), { vehiculoId, clienteId: user.id })
            .then(() => {
                setFavoriteVehiculos((prev) => [...prev, vehiculoId]);  // Actualiza el estado con el nuevo favorito
            })
            .catch((error) => console.error("Error al agregar a favoritos:", error));
    };

    const handleRemoveFromFavorites = (vehiculoId) => {
        axios
            .delete(route("favoritos.remove"), { data: { vehiculoId, clienteId: user.id } })
            .then(() => {
                setFavoriteVehiculos((prev) =>
                    prev.filter((id) => id !== vehiculoId)  // Elimina el favorito del estado
                );
            })
            .catch((error) => console.error("Error al eliminar de favoritos:", error));
    };

    const isFavorite = (vehiculoId) => favoriteVehiculos.includes(vehiculoId);
    console.log(vehiculo)

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
                    <div className="w-full lg:w-1/3 p-6 border border-gray-200 rounded-lg shadow-lg bg-white flex flex-col justify-between relative">
                    <div className="absolute top-300 right-12">
                    {isFavorite(vehiculo.id) ? (
                                                <button onClick={() => handleRemoveFromFavorites(vehiculo.id)}>
                                                    
                                                    <svg className="hover:w-12 hover:h-12 duration-500" xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24">
                                                        <path fill="currentColor" d="m12 21l-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812T2.388 10.4T2 8.15Q2 5.8 3.575 4.225T7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55t2.475-.55q2.35 0 3.925 1.575T22 8.15q0 1.15-.387 2.25t-1.363 2.412t-2.625 2.963T13.45 19.7z"/>
                                                    </svg>
                                                  
                                                </button>
                                            ) : (
                                                <button onClick={() => handleAddToFavorites(vehiculo.id)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                                                        <path fill="currentColor" d="m12 21l-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812T2.388 10.4T2 8.15Q2 5.8 3.575 4.225T7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55t2.475-.55q2.35 0 3.925 1.575T22 8.15q0 1.15-.387 2.25t-1.363 2.412t-2.625 2.963T13.45 19.7zm0-2.7q2.4-2.15 3.95-3.687t2.45-2.675t1.25-2.026T20 8.15q0-1.5-1-2.5t-2.5-1q-1.175 0-2.175.662T12.95 7h-1.9q-.375-1.025-1.375-1.687T7.5 4.65q-1.5 0-2.5 1t-1 2.5q0 .875.35 1.763t1.25 2.025t2.45 2.675T12 18.3m0-6.825"/>
                                                    </svg>
                                                </button>
                                            )}
                                            </div>
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
                className="p-8 max-w-3xl mx-auto my-64 bg-white rounded-lg shadow-lg border border-gray-200"
            >
                <button
                    onClick={closeModal1}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                >
                    &times;
                </button>
        
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
                                    {/* Mapa de ubicación del concesionario */}
                                    <div className="container mx-auto px-4 mb-12 mt-24">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">Dónde estamos</h2>
                <GoogleMap
                    lat={-38.9516}
                    lng={-68.0591}
                    zoom={14}
                    markerTitle="Concesionaria FR"
                    height="380px"
                />
            </div>
            <Footer></Footer>
        </>
    );
}
