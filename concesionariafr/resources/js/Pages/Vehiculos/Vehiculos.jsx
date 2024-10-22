import React, { useState, useEffect } from 'react';
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const Vehiculos = ({ vehiculos, marcas, modelos, categorias, combustibles, transmisiones }) => {
    const [filteredVehiculos, setFilteredVehiculos] = useState(vehiculos);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMarcas, setSelectedMarcas] = useState([]);
    const [selectedModelos, setSelectedModelos] = useState([]);
    const [selectedCategoria, setSelectedCategoria] = useState('');
    const [selectedCombustible, setSelectedCombustible] = useState('');
    const [selectedTransmision, setSelectedTransmision] = useState('');

    // Actualiza los vehículos filtrados en función de los términos de búsqueda y los filtros seleccionados
    useEffect(() => {
        let filtered = vehiculos;

        // Filtrar por términos de búsqueda
        if (searchTerm) {
            filtered = filtered.filter((vehiculo) =>
                vehiculo.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
                vehiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filtrar por marcas seleccionadas
        if (selectedMarcas.length > 0) {
            filtered = filtered.filter((vehiculo) => selectedMarcas.includes(vehiculo.marca));
        }

        // Filtrar por modelos seleccionados
        if (selectedModelos.length > 0) {
            filtered = filtered.filter((vehiculo) => selectedModelos.includes(vehiculo.modelo));
        }

        // Filtrar por categoría
        if (selectedCategoria) {
            filtered = filtered.filter((vehiculo) => vehiculo.idCategoria === parseInt(selectedCategoria));
        }

        // Filtrar por combustible
        if (selectedCombustible) {
            filtered = filtered.filter((vehiculo) => vehiculo.idCombustible === parseInt(selectedCombustible));
        }

        // Filtrar por transmisión
        if (selectedTransmision) {
            filtered = filtered.filter((vehiculo) => vehiculo.idTransmision === parseInt(selectedTransmision));
        }

        setFilteredVehiculos(filtered);
    }, [searchTerm, selectedMarcas, selectedModelos, selectedCategoria, selectedCombustible, selectedTransmision, vehiculos]);

    // Manejo de los checkbox
    const handleCheckboxChange = (e, setStateFunction, selectedItems) => {
        const value = e.target.value;
        const checked = e.target.checked;

        if (checked) {
            setStateFunction([...selectedItems, value]);
        } else {
            setStateFunction(selectedItems.filter((item) => item !== value));
        }
    };

    return (
        <div className="flex">
            {/* Filtros */}
            <div className="w-1/4 p-4">
                <div className="mb-4">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar..."
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>

                {/* Filtros por checkbox */}
                <div className="mb-4">
                    <h4>Marcas</h4>
                    {marcas.map((marca) => (
                        <div key={marca.marca}>
                            <input
                                type="checkbox"
                                value={marca.marca}
                                onChange={(e) => handleCheckboxChange(e, setSelectedMarcas, selectedMarcas)}
                            />
                            <label>{marca.marca}</label>
                        </div>
                    ))}
                </div>

                <div className="mb-4">
                    <h4>Modelos</h4>
                    {modelos.map((modelo) => (
                        <div key={modelo.modelo}>
                            <input
                                type="checkbox"
                                value={modelo.modelo}
                                onChange={(e) => handleCheckboxChange(e, setSelectedModelos, selectedModelos)}
                            />
                            <label>{modelo.modelo}</label>
                        </div>
                    ))}
                </div>

                <div className="mb-4">
                    <h4>Categoría</h4>
                    <select
                        value={selectedCategoria}
                        onChange={(e) => setSelectedCategoria(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
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
                    <h4>Combustible</h4>
                    <select
                        value={selectedCombustible}
                        onChange={(e) => setSelectedCombustible(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
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
                    <h4>Transmisión</h4>
                    <select
                        value={selectedTransmision}
                        onChange={(e) => setSelectedTransmision(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
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
            <div className="w-3/4 p-4">
                <h2 className="text-2xl mb-4">Vehículos</h2>
                {filteredVehiculos.length ? (
                    filteredVehiculos.map((vehiculo) => (
                        <div key={vehiculo.id} className="border-b border-gray-300 mb-4">
                            <h3 className="text-xl">{vehiculo.marca} {vehiculo.modelo}</h3>
                            <p>Año: {vehiculo.anio}</p>
                            <p>Precio: {vehiculo.precio}</p>
                        </div>
                    ))
                ) : (
                    <p>No se encontraron vehículos.</p>
                )}
            </div>
        </div>
    );
};

export default Vehiculos;
