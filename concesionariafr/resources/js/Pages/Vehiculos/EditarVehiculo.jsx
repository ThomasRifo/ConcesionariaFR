import React, { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import GuestLayout2 from "@/Layouts/GuestLayout2";
import Modal from "react-modal";
import Swal from "sweetalert2";

const VehiculosCRUD = ({ vehiculos, categorias, combustibles, transmisiones, estados }) => {
    const [filteredVehiculos, setFilteredVehiculos] = useState(vehiculos);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategoria, setSelectedCategoria] = useState("");
    const [selectedCombustible, setSelectedCombustible] = useState("");
    const [selectedTransmision, setSelectedTransmision] = useState("");
    const [selectedEstado, setSelectedEstado] = useState("");
    const [selectedVehiculo, setSelectedVehiculo] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        let filtered = vehiculos;

        if (searchTerm) {
            filtered = filtered.filter(
                (vehiculo) =>
                    vehiculo.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    vehiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategoria) {
            filtered = filtered.filter(
                (vehiculo) => vehiculo.idCategoria === parseInt(selectedCategoria)
            );
        }

        if (selectedCombustible) {
            filtered = filtered.filter(
                (vehiculo) => vehiculo.idCombustible === parseInt(selectedCombustible)
            );
        }

        if (selectedTransmision) {
            filtered = filtered.filter(
                (vehiculo) => vehiculo.idTransmision === parseInt(selectedTransmision)
            );
        }

        if (selectedEstado) {
            filtered = filtered.filter(
                (vehiculo) => vehiculo.idEstado === parseInt(selectedEstado)
            );
        }

        setFilteredVehiculos(filtered);
    }, [searchTerm, selectedCategoria, selectedCombustible, selectedTransmision, selectedEstado, vehiculos]);

    const handleEdit = (vehiculo) => {
        setSelectedVehiculo(vehiculo);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedVehiculo(null);
        setIsModalOpen(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        router.put(`/vehiculos/${selectedVehiculo.id}`, {
            marca: formData.get("marca"),
            modelo: formData.get("modelo"),
            anio: formData.get("anio"),
            patente: formData.get("patente"),
            color: formData.get("color"),
            kilometraje: formData.get("kilometraje"),
            precio: formData.get("precio"),
            idCategoria: formData.get("idCategoria"),
            idCombustible: formData.get("idCombustible"),
            idTransmision: formData.get("idTransmision"),
            idEstado: formData.get("idEstado"),
        }, {
            onSuccess: () => handleCloseModal(),
        });
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "¡Este cambio no podrá deshacerse!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminarlo",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/vehiculos/${id}`, {
                    onSuccess: () => {
                        Swal.fire("¡Eliminado!", "El vehículo ha sido eliminado.", "success");
                    },
                });
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <GuestLayout2>
            <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Editar Vehiculos</h2>
            <div className="p-4">
                <div className="mb-6 flex justify-between items-center">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar vehículos por marca o modelo"
                        className="w-1/3 p-2 border rounded"
                    />
                </div>
                <table className="table-auto w-full border-collapse border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-4 py-2">Marca</th>
                            <th className="border px-4 py-2">Modelo</th>
                            <th className="border px-4 py-2">Año</th>
                            <th className="border px-4 py-2">Patente</th>
                            <th className="border px-4 py-2">Color</th>
                            <th className="border px-4 py-2">Kilometraje</th>
                            <th className="border px-4 py-2">Precio</th>
                            <th className="border px-4 py-2">Categoría</th>
                            <th className="border px-4 py-2">Combustible</th>
                            <th className="border px-4 py-2">Transmisión</th>
                            <th className="border px-4 py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVehiculos.map((vehiculo) => (
                            <tr key={vehiculo.id}>
                                <td className="border px-4 py-2">{vehiculo.marca}</td>
                                <td className="border px-4 py-2">{vehiculo.modelo}</td>
                                <td className="border px-4 py-2">{vehiculo.anio}</td>
                                <td className="border px-4 py-2">{vehiculo.patente}</td>
                                <td className="border px-4 py-2">{vehiculo.color}</td>
                                <td className="border px-4 py-2">{vehiculo.kilometraje} Km</td>
                                <td className="border px-4 py-2">${vehiculo.precio}</td>
                                <td className="border px-4 py-2">{vehiculo.categoria?.tipo}</td>
                                <td className="border px-4 py-2">{vehiculo.combustible?.tipo}</td>
                                <td className="border px-4 py-2">{vehiculo.transmision?.tipo}</td>
                                <td className="border px-4 py-2 flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(vehiculo)}
                                        className="bg-white text-black border border-black px-3 py-1 rounded transition-all duration-300 hover:bg-black hover:text-white"
                                            >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(vehiculo.id)}
                                        className="bg-white text-black border border-black px-3 py-1 rounded transition-all duration-300 hover:bg-black hover:text-white"
                                            >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
    isOpen={isModalOpen}
    onRequestClose={handleCloseModal}
    contentLabel="Editar Vehículo"
    className="bg-white p-4 rounded shadow-md w-4/5 max-w-4xl mx-auto mt-10"  // Modal más ancho
    overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
>
    {selectedVehiculo && (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="block text-xs font-medium">Marca</label>
                <input
                    type="text"
                    name="marca"
                    defaultValue={selectedVehiculo.marca}
                    className="border rounded px-3 py-1 w-full text-xs"  // Inputs más pequeños
                />
            </div>
            <div className="mb-3">
                <label className="block text-xs font-medium">Modelo</label>
                <input
                    type="text"
                    name="modelo"
                    defaultValue={selectedVehiculo.modelo}
                    className="border rounded px-3 py-1 w-full text-xs"
                />
            </div>
            <div className="mb-3">
                <label className="block text-xs font-medium">Año</label>
                <input
                    type="text"
                    name="anio"
                    defaultValue={selectedVehiculo.anio}
                    className="border rounded px-3 py-1 w-full text-xs"
                />
            </div>
            <div className="mb-3">
                <label className="block text-xs font-medium">Patente</label>
                <input
                    type="text"
                    name="patente"
                    defaultValue={selectedVehiculo.patente}
                    className="border rounded px-3 py-1 w-full text-xs"
                />
            </div>
            <div className="mb-3">
                <label className="block text-xs font-medium">Color</label>
                <input
                    type="text"
                    name="color"
                    defaultValue={selectedVehiculo.color}
                    className="border rounded px-3 py-1 w-full text-xs"
                />
            </div>
            <div className="mb-3">
                <label className="block text-xs font-medium">Kilometraje</label>
                <input
                    type="number"
                    name="kilometraje"
                    defaultValue={selectedVehiculo.kilometraje}
                    className="border rounded px-3 py-1 w-full text-xs"
                />
            </div>
            <div className="mb-3">
                <label className="block text-xs font-medium">Precio</label>
                <input
                    type="number"
                    name="precio"
                    defaultValue={selectedVehiculo.precio}
                    className="border rounded px-3 py-1 w-full text-xs"
                />
            </div>
            <div className="mb-3">
                <label className="block text-xs font-medium">Categoría</label>
                <select
                    name="idCategoria"
                    defaultValue={selectedVehiculo.idCategoria}
                    className="border rounded px-3 py-1 w-full text-xs"
                >
                    {categorias.map((categoria) => (
                        <option key={categoria.id} value={categoria.id}>
                            {categoria.tipo}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-3">
                <label className="block text-xs font-medium">Combustible</label>
                <select
                    name="idCombustible"
                    defaultValue={selectedVehiculo.idCombustible}
                    className="border rounded px-3 py-1 w-full text-xs"
                >
                    {combustibles.map((combustible) => (
                        <option key={combustible.id} value={combustible.id}>
                            {combustible.tipo}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-3">
                <label className="block text-xs font-medium">Transmisión</label>
                <select
                    name="idTransmision"
                    defaultValue={selectedVehiculo.idTransmision}
                    className="border rounded px-3 py-1 w-full text-xs"
                >
                    {transmisiones.map((transmision) => (
                        <option key={transmision.id} value={transmision.id}>
                            {transmision.tipo}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-3">
                <label className="block text-xs font-medium">Estado</label>
                <select
                    name="idEstado"
                    defaultValue={selectedVehiculo.idEstado}
                    className="border rounded px-3 py-1 w-full text-xs"
                >
                    {estados.map((estadoVehiculo) => (
                        <option key={estadoVehiculo.id} value={estadoVehiculo.id}>
                            {estadoVehiculo.estado}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex justify-end mt-4">
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded text-xs"
                >
                    Guardar cambios
                </button>
                <button
                    type="button"
                    onClick={handleCloseModal}
                    className="bg-gray-500 text-white px-4 py-2 rounded ml-2 text-xs"
                >
                    Cancelar
                </button>
            </div>
        </form>
    )}
</Modal>
</GuestLayout2>
        </AuthenticatedLayout>
    );
};

export default VehiculosCRUD;
