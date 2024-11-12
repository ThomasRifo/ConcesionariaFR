import NavbarClient from "@/Layouts/NavbarClient";
import { Head } from '@inertiajs/react';

export default function VehiculoDetalle({ vehiculo }) {
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
                </div>
            </div>
        </>
    );
}