import React, { useState, useEffect } from 'react';
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from 'react-modal';
import AgendarCita from '../Agenda/AgendarCita';

const Vehiculos = ({ vehiculos, marcas, modelos, categorias, combustibles, transmisiones }) => {
    const [filteredVehiculos, setFilteredVehiculos] = useState(vehiculos);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMarcas, setSelectedMarcas] = useState([]);
    const [selectedModelos, setSelectedModelos] = useState([]);
    const [selectedCategoria, setSelectedCategoria] = useState('');
    const [selectedCombustible, setSelectedCombustible] = useState('');
    const [selectedTransmision, setSelectedTransmision] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedVehiculo, setSelectedVehiculo] = useState(null);

    useEffect(() => {
        let filtered = vehiculos;
        if (searchTerm) {
            filtered = filtered.filter((vehiculo) =>
                vehiculo.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
                vehiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (selectedMarcas.length > 0) {
            filtered = filtered.filter((vehiculo) => selectedMarcas.includes(vehiculo.marca));
        }
        if (selectedModelos.length > 0) {
            filtered = filtered.filter((vehiculo) => selectedModelos.includes(vehiculo.modelo));
        }
        if (selectedCategoria) {
            filtered = filtered.filter((vehiculo) => vehiculo.idCategoria === parseInt(selectedCategoria));
        }
        if (selectedCombustible) {
            filtered = filtered.filter((vehiculo) => vehiculo.idCombustible === parseInt(selectedCombustible));
        }
        if (selectedTransmision) {
            filtered = filtered.filter((vehiculo) => vehiculo.idTransmision === parseInt(selectedTransmision));
        }
        setFilteredVehiculos(filtered);
    }, [searchTerm, selectedMarcas, selectedModelos, selectedCategoria, selectedCombustible, selectedTransmision, vehiculos]);

    const handleCheckboxChange = (e, setStateFunction, selectedItems) => {
        const value = e.target.value;
        const checked = e.target.checked;
        if (checked) {
            setStateFunction([...selectedItems, value]);
        } else {
            setStateFunction(selectedItems.filter((item) => item !== value));
        }
    };

    const openModal = (vehiculo) => {
        setSelectedVehiculo(vehiculo);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedVehiculo(null);
    };

    return (
        <div className="container mx-auto p-6">
            {/* Buscador */}
            <div className="flex justify-center mb-6">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar vehículos..."
                    className="w-full max-w-lg p-3 border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-[#800000]"
                />
            </div>

            <div className="flex justify-between space-x-8">
                {/* Filtros */}
                <div className="w-1/4 p-4 bg-white rounded-lg shadow-lg border border-gray-200">
                    <h4 className="font-semibold text-lg mb-3">Filtros</h4>
                    <div className="mb-4">
                        <h5 className="font-medium">Marcas</h5>
                        {marcas.map((marca) => (
                            <div key={marca.marca} className="flex items-center">
                                <input
                                    type="checkbox"
                                    value={marca.marca}
                                    onChange={(e) => handleCheckboxChange(e, setSelectedMarcas, selectedMarcas)}
                                    className="mr-2"
                                />
                                <label>{marca.marca}</label>
                            </div>
                        ))}
                    </div>
                    <div className="mb-4">
                        <h5 className="font-medium">Modelos</h5>
                        {modelos.map((modelo) => (
                            <div key={modelo.modelo} className="flex items-center">
                                <input
                                    type="checkbox"
                                    value={modelo.modelo}
                                    onChange={(e) => handleCheckboxChange(e, setSelectedModelos, selectedModelos)}
                                    className="mr-2"
                                />
                                <label>{modelo.modelo}</label>
                            </div>
                        ))}
                    </div>
                    <div className="mb-4">
                        <h5 className="font-medium">Categoría</h5>
                        <select
                            value={selectedCategoria}
                            onChange={(e) => setSelectedCategoria(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="">Todas</option>
                            {categorias.map((categoria) => (
                                <option key={categoria.id} value={categoria.id}>
                                    {categoria.tipo}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <h5 className="font-medium">Combustible</h5>
                        <select
                            value={selectedCombustible}
                            onChange={(e) => setSelectedCombustible(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="">Todos</option>
                            {combustibles.map((combustible) => (
                                <option key={combustible.id} value={combustible.id}>
                                    {combustible.tipo}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <h5 className="font-medium">Transmisión</h5>
                        <select
                            value={selectedTransmision}
                            onChange={(e) => setSelectedTransmision(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="">Todas</option>
                            {transmisiones.map((transmision) => (
                                <option key={transmision.id} value={transmision.id}>
                                    {transmision.tipo}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Listado de vehículos */}
                <div className="w-3/4">
                    <h2 className="text-2xl font-bold mb-4">Vehículos</h2>
                    {filteredVehiculos.length ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredVehiculos.map((vehiculo) => (
                                <div
                                    key={vehiculo.id}
                                    className="p-4 border border-gray-200 rounded-lg shadow-lg transition transform hover:scale-105"
                                    style={{ maxWidth: '280px' }}
                                >
                                    <h3 className="text-lg font-semibold mb-1">
                                        {vehiculo.marca} {vehiculo.modelo}
                                    </h3>
                                    <p className="text-gray-500 text-sm">Año: {vehiculo.anio}</p>
                                    <p className="text-gray-900 font-bold">Precio: {vehiculo.precio}</p>
                                    <button
                                        className="mt-3 bg-[#800000] text-white py-2 px-4 rounded-md w-full hover:bg-red-700"
                                        onClick={() => openModal(vehiculo)}
                                    >
                                        Agendar Cita
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No se encontraron vehículos.</p>
                    )}
                </div>
            </div>

            {/* Modal para Agendar Cita */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Agendar Cita"
                ariaHideApp={false}
            >
                <h2>Agendar Cita para {selectedVehiculo ? `${selectedVehiculo.marca} ${selectedVehiculo.modelo}` : ''}</h2>
                <AgendarCita vehiculo={selectedVehiculo} closeModal={closeModal} />
            </Modal>
        </div>
    );
};

export default Vehiculos;
