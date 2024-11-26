import React, { useState } from 'react';
import Modal from 'react-modal';
import Financiacion from "@/components/Financiacion";
import FinanciacionPDF from "@/components/FinanciacionPDF";
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Link, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';

export default function Presupuesto({ vehiculo, monto, cuotas, cuotaFija, tasa, lineaFinanciamiento }) {

    const saldoCancelar = vehiculo.precio - monto;
    const formatPrecio = (precio) => {
        return new Intl.NumberFormat('es-ES').format(precio);
    };
    const { user } = usePage().props.auth;

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

                {user ? (
            <PDFDownloadLink
                document={<FinanciacionPDF vehiculo={vehiculo} user={user}                   monto={monto} 
                cuotas={cuotas}
                tasa={tasa} 
                cuotaFija={cuotaFija} 
                lineaFinanciamientoNombre={lineaFinanciamiento.nombre} 
                lineaFinanciamientoEntidad={lineaFinanciamiento.entidad}
                />}

                fileName={`${vehiculo.marca}-${vehiculo.modelo}-${dayjs().format('YYYY-MM-DD')}.pdf`}
                className="mt-3 bg-[#800000] text-white py-2 px-4 rounded-md w-full text-center hover:bg-red-700 block"
            >
                {({ loading }) => (loading ? 'Cargando documento...' : 'Presupuestar auto')}
            </PDFDownloadLink>
        ) : (
            <Link
                href={route('login')}
                className="mt-3 bg-[#800000] text-white py-2 px-4 rounded-md w-full text-center hover:bg-red-700 block"
            >
                Iniciar sesión para descargar el presupuesto detallado
            </Link>
        )}


                <div className="flex space-x-4">
                </div>
            </div>

        </>
    );
}
