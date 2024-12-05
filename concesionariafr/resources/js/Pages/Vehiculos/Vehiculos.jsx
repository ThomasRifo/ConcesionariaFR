import React, { useState, useEffect } from "react";
import { Head, usePage, Link } from "@inertiajs/react";
import NavbarClient from "@/Layouts/NavbarClient";

const Vehiculos = ({
    vehiculos,
    marcas,
    modelos,
    categorias,
    combustibles,
    transmisiones,
    favoritos,
}) => {
    const [filteredVehiculos, setFilteredVehiculos] = useState(vehiculos);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMarcas, setSelectedMarcas] = useState([]);
    const [selectedModelos, setSelectedModelos] = useState([]);
    const [selectedCategoria, setSelectedCategoria] = useState("");
    const [selectedCombustible, setSelectedCombustible] = useState("");
    const [selectedTransmision, setSelectedTransmision] = useState("");
    const [favoriteVehiculos, setFavoriteVehiculos] = useState(favoritos);  // Inicializa con los favoritos pasados desde el backend.

    useEffect(() => {
        let filtered = vehiculos;
        if (searchTerm) {
            filtered = filtered.filter(
                (vehiculo) =>
                    vehiculo.marca
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    vehiculo.modelo
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
        }
        if (selectedMarcas.length > 0) {
            filtered = filtered.filter((vehiculo) =>
                selectedMarcas.includes(vehiculo.marca)
            );
        }
        if (selectedModelos.length > 0) {
            filtered = filtered.filter((vehiculo) =>
                selectedModelos.includes(vehiculo.modelo)
            );
        }
        if (selectedCategoria) {
            filtered = filtered.filter(
                (vehiculo) =>
                    vehiculo.idCategoria === parseInt(selectedCategoria)
            );
        }
        if (selectedCombustible) {
            filtered = filtered.filter(
                (vehiculo) =>
                    vehiculo.idCombustible === parseInt(selectedCombustible)
            );
        }
        if (selectedTransmision) {
            filtered = filtered.filter(
                (vehiculo) =>
                    vehiculo.idTransmision === parseInt(selectedTransmision)
            );
        }
        setFilteredVehiculos(filtered);
    }, [
        searchTerm,
        selectedMarcas,
        selectedModelos,
        selectedCategoria,
        selectedCombustible,
        selectedTransmision,
        vehiculos,
    ]);

    const handleCheckboxChange = (e, setStateFunction, selectedItems) => {
        const value = e.target.value;
        const checked = e.target.checked;
        setStateFunction(
            checked
                ? [...selectedItems, value]
                : selectedItems.filter((item) => item !== value)
        );
    };

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

    return (
        <>
        <Head title="Vehículos" />
        <NavbarClient />
        <div className="h-2/3 h-[76vh] overflow-hidden">
            <img
                src="https://autocity.com.ar/wp-content/uploads/2022/01/autocity-seis-marcas.jpeg"
                className="w-full -mt-24 object-cover"
                alt="Imagen de autos"
            />
        </div>
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
                            <div
                                key={marca.marca}
                                className="flex items-center"
                            >
                                <input
                                    type="checkbox"
                                    value={marca.marca}
                                    onChange={(e) =>
                                        handleCheckboxChange(
                                            e,
                                            setSelectedMarcas,
                                            selectedMarcas
                                        )
                                    }
                                    className="mr-2"
                                />
                                <label>{marca.marca}</label>
                            </div>
                        ))}
                    </div>
                    <div className="mb-4">
                        <h5 className="font-medium">Modelos</h5>
                        {modelos.map((modelo) => (
                            <div
                                key={modelo.modelo}
                                className="flex items-center"
                            >
                                <input
                                    type="checkbox"
                                    value={modelo.modelo}
                                    onChange={(e) =>
                                        handleCheckboxChange(
                                            e,
                                            setSelectedModelos,
                                            selectedModelos
                                        )
                                    }
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
                            onChange={(e) =>
                                setSelectedCategoria(e.target.value)
                            }
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="">Todas</option>
                            {categorias.map((categoria) => (
                                <option
                                    key={categoria.id}
                                    value={categoria.id}
                                >
                                    {categoria.tipo}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <h5 className="font-medium">Combustible</h5>
                        <select
                            value={selectedCombustible}
                            onChange={(e) =>
                                setSelectedCombustible(e.target.value)
                            }
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="">Todos</option>
                            {combustibles.map((combustible) => (
                                <option
                                    key={combustible.id}
                                    value={combustible.id}
                                >
                                    {combustible.tipo}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <h5 className="font-medium">Transmisión</h5>
                        <select
                            value={selectedTransmision}
                            onChange={(e) =>
                                setSelectedTransmision(e.target.value)
                            }
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="">Todas</option>
                            {transmisiones.map((transmision) => (
                                <option
                                    key={transmision.id}
                                    value={transmision.id}
                                >
                                    {transmision.tipo}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="w-3/4">
                        {filteredVehiculos.length ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredVehiculos.map((vehiculo) => (
                                    <div key={vehiculo.id} className="block relative">
                                        <div className="absolute top-2 right-2">
                                            {isFavorite(vehiculo.id) ? (
                                                <button onClick={() => handleRemoveFromFavorites(vehiculo.id)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
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
                                        <Link
                                            href={route("vehiculo.show", {
                                                marca: vehiculo.marca,
                                                modelo: vehiculo.modelo,
                                                anio: vehiculo.anio,
                                            })}
                                            className="block"
                                        >
                                            <div className="border rounded-lg shadow-md p-4">
                                                <img
                                                    src={`/storage/${vehiculo.imagenes[0]?.urlImagen || "default-image.jpg"}`}
                                                    alt={vehiculo.modelo}
                                                    className="w-full h-48 object-cover mb-4"
                                                />
                                                <h3 className="text-lg font-semibold">{vehiculo.marca} {vehiculo.modelo}</h3>
                                                <p className="text-gray-600">{vehiculo.anio}</p>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-lg">No se encontraron vehículos.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Vehiculos;
