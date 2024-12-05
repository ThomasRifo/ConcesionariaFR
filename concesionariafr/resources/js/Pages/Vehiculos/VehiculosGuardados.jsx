import React, { useState, useEffect } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import NavbarClient from "@/Layouts/NavbarClient";

const VehiculosGuardados = ({ vehiculos,     combustibles,
    transmisiones,}) => {
    const { user } = usePage().props.auth;

    // Inicializa el estado con los vehículos favoritos pasados desde el backend
    const [favoriteVehiculos, setFavoriteVehiculos] = useState(vehiculos);

    const handleRemoveFromFavorites = (vehiculoId) => {
        axios
            .delete(route("favoritos.remove"), {
                data: { vehiculoId, clienteId: user.id },
            })
            .then(() => {
                // Elimina el vehículo de la lista de favoritos en el estado
                setFavoriteVehiculos((prev) =>
                    prev.filter((vehiculo) => vehiculo.id !== vehiculoId)
                );
            })
            .catch((error) =>
                console.error("Error al eliminar de favoritos:", error)
            );
    };


    
    console.log(vehiculos);

    return (
        <>
            <Head title="Favoritos" />
            <NavbarClient isBlackBg={true} />
            <div className="mt-36 container mx-auto px-6 lg:px-12 space-y-12 w-3/5">
                <h1 className="text-3xl font-bold m-center">Favoritos</h1>
                {favoriteVehiculos.length > 0 ? (
                    <div className="vehiculos-list space-y-4">
                        {favoriteVehiculos.map((vehiculo) => (
                            <div
                                key={vehiculo.id}
                                className="flex items-start p-4 bg-gray-100 text-black rounded-md shadow-md border-b-2 border-gray-500 w-full"
                            >
                                {/* Imagen del vehículo */}
                                <div className="h-36 flex-shrink-0">
                                    <img
                                        src={`/storage/${
                                            vehiculo.imagen_principal
                                                ?.urlImagen ||
                                            "default-image.jpg"
                                        }`}
                                        alt={`${vehiculo.marca} ${vehiculo.modelo}`}
                                        className="w-full h-full object-cover rounded-md"
                                    />
                                </div>

                                {/* Información del vehículo */}
                                <div className="ml-6 flex-1 text-sm text-gray-700">
                                    <h2 className="text-lg font-semibold">{`${vehiculo.marca} ${vehiculo.modelo} (${vehiculo.anio})`}</h2>
                                    <p className="">
                                        Precio: $
                                        {vehiculo.precio}
                                    </p>
                                    <p>
                                        <strong>Kilometraje:</strong>{" "}
                                        {vehiculo.kilometraje} km
                                    </p>
                                    <p>
                                        <strong>Color:</strong> {vehiculo.color}
                                    </p>
                                    <p><strong>Combustible:</strong> {vehiculo.combustible ? vehiculo.combustible.tipo : 'No especificado'}</p>
<p><strong>Transmisión:</strong> {vehiculo.transmision ? vehiculo.transmision.tipo : 'No especificada'}</p>

                                    <Link
                                        href={route("vehiculo.show", {
                                            marca: vehiculo.marca,
                                            modelo: vehiculo.modelo,
                                            anio: vehiculo.anio,
                                        })}
                                        className="text-blue-400 hover:underline mt-2 inline-block"
                                    >
                                        Ver detalles
                                    </Link>
                                </div>
                                <button
                                    onClick={() =>
                                        handleRemoveFromFavorites(vehiculo.id)
                                    }
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <p style={{ marginRight: "8px" }}>
                                        Eliminar de favoritos
                                    </p>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                        alt="Eliminar de favoritos"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="m12 21l-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812T2.388 10.4T2 8.15Q2 5.8 3.575 4.225T7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55t2.475-.55q2.35 0 3.925 1.575T22 8.15q0 1.15-.387 2.25t-1.363 2.412t-2.625 2.963T13.45 19.7z"
                                        />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No tienes vehículos guardados.</p>
                )}
            </div>
        </>
    );
};

export default VehiculosGuardados;
