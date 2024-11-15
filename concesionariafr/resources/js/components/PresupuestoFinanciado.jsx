import React, { useState } from 'react';
import Modal from 'react-modal';
import Financiacion from "@/components/Financiacion";

export default function Presupuesto({ vehiculo, monto, cuotas, cuotaFija, tasa }) {

    const saldoCancelar = vehiculo.precio - monto;
    const formatPrecio = (precio) => {
        return new Intl.NumberFormat('es-ES').format(precio);
    };

    return (
        <>
            <div>
                <h2>{vehiculo.marca} </h2>
                <p>Precio del vehículo: <strong className='text-lg'> $ {formatPrecio(vehiculo.precio)}</strong></p>
                <p>Capital a financiar: <strong className='text-lg' >- $ {formatPrecio(monto)} </strong></p>
                <p>Cuota fija mensual: <strong > $ {formatPrecio(cuotaFija)} </strong></p>
                <p>Meses del prestamo: <strong > {cuotas} </strong></p>
                <p>TNA: <strong>{tasa}% </strong></p>
                <p>Saldo a cancelar: <strong className='text-xl'> ${formatPrecio(saldoCancelar)}</strong> </p>


                <div className="flex space-x-4">
                </div>
            </div>

        </>
    );
}
