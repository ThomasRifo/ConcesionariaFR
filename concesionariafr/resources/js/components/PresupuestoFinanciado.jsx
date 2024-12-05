import React, { useState } from 'react';
import Modal from 'react-modal';
import Financiacion from "@/components/Financiacion";
import FinanciacionPDF from "@/components/FinanciacionPDF";
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Link, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';

export default function Presupuesto({ vehiculo, monto, cuotas, cuotaFija, tasa, lineaFinanciamiento }) {

    const saldoCancelar = vehiculo.precio*1.004 - monto;
    const formatPrecio = (precio) => {
        return new Intl.NumberFormat('es-ES').format(precio);
    };
    const { user } = usePage().props.auth;

    return (
        <>
            <div>
            <h2 className="text-2xl font-bold mt-2">
                    {vehiculo.marca} {vehiculo.modelo}
                </h2>
                <p>
                    {" "}
                    {vehiculo.anio} | Usado | {vehiculo.combustible} |{" "}
                    {vehiculo.transmision}{" "}
                </p>
                <div className='mt-6 px-2'>
                <div className="mt-4  text-lg flex justify-between border-b-2 pb-4 border-gray-100">Precio del vehículo: <p className='text-xl font-black'> $ {formatPrecio(vehiculo.precio)}</p></div>
                <div className="mt-4  text-lg flex justify-between pb-4 border-b-2 border-gray-100">
                    Gastos de entrega <strong className='text-lg' >- $ {formatPrecio(vehiculo.precio*0.04)} </strong></div>
                <div className="mt-4  text-lg flex justify-between">Capital a financiar: <strong className='text-xl' >- $ {formatPrecio(monto)} </strong></div>
                <div className="mt-4 text-gray-400  text-base flex justify-between">Cuota fija mensual: <p > $ {formatPrecio(cuotaFija)} </p></div>
                <div className="mt-4 text-gray-400 text-base flex justify-between">Meses del prestamo: <p > {cuotas} </p></div>
                <div className="mt-4 text-gray-400 text-base flex justify-between pb-4 border-b-2 border-gray-100">TNA: <p>{tasa}% </p></div>
                <div className="mt-4  text-lg flex justify-between">Saldo a cancelar: <strong className='text-xl'> ${formatPrecio(saldoCancelar)}</strong> </div>
                </div>
                <div className="flex space-x-6 mt-12 flex-col sm:flex-row  ">
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
                className="mt-8 sm:mt-0 w-full sm:w-auto bg-white text-black border border-black py-2 px-6 rounded-md hover:bg-black hover:text-white transition-all m-auto"
            >
                {({ loading }) => (loading ? 'Cargando documento...' : 'Descargar presupuesto')}
            </PDFDownloadLink>
        ) : (
            <Link
                href={route('login')}
                className="mt-8 sm:mt-0 w-full sm:w-auto bg-white text-black border border-black py-2 px-6 rounded-md hover:bg-black hover:text-white transition-all m-auto"
            >
                Iniciar sesión para descargar el presupuesto detallado
            </Link>
        )}
        </div>


                <div className="flex space-x-4">
                </div>
            </div>

        </>
    );
}
