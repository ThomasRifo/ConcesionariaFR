import React from 'react';
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout2 from '@/Layouts/GuestLayout2';

const Empleados = ({ empleados }) => {
    return (
        <AuthenticatedLayout 
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight justify-start">Empleados</h2>}
        >
            <GuestLayout2>
            <Head title="Empleados" />
            <div className="p-4">
                <h2 className="text-2xl mb-4">Lista de Empleados</h2>
                {empleados.length ? (
                    empleados.map((empleado) => (
                        <div key={empleado.id} className="border-b border-gray-300 mb-4 pb-4">
                            <h3 className="text-xl">{empleado.name} {empleado.lastname}</h3>
                            <p>Email: {empleado.email}</p>
                            <p>DNI: {empleado.dni}</p>
                            <h4 className="mt-2">Ventas:</h4>
                            {empleado.ventas.length ? (
                                <ul>
                                    {empleado.ventas.map((venta) => (
                                        <li key={venta.id}>
                                            <p>ID Vehículo: {venta.idVehiculo}</p>
                                            <p>Monto Total: {venta.montoTotal}</p>
                                            <p>Fecha: {venta.fechaVenta}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No hay ventas para este empleado.</p>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No se encontraron empleados.</p>
                )}
            </div>
            </GuestLayout2>
        </AuthenticatedLayout>
    );
};

export default Empleados;
