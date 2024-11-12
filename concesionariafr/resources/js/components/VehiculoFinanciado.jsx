import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import PresupuestoFinanciado from "@/components/PresupuestoFinanciado";
import Modal from 'react-modal';

const VehiculoFinanciado = ({ monto, cuotas, tasa, lineaFinanciamiento, vehiculo, onClose }) => {
    const [amortizacion, setAmortizacion] = useState([]);
    const [totalIntereses, setTotalIntereses] = useState(0);
    const [totalCapital, setTotalCapital] = useState(0);
    const [cuotaFija, setCuotaFija] = useState(0); // Estado para la cuota mensual fija
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    const calcularCuotaFija = (monto, cuotas, tasa) => {
        const tasaMensual = tasa / 100 / 12; // Convertimos la tasa anual a mensual
        return (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -cuotas));
    };

    const calcularAmortizacion = (monto, cuotas, tasa) => {
        const tasaMensual = tasa / 100 / 12;
        const cuotaFija = calcularCuotaFija(monto, cuotas, tasa);

        let saldoRestante = monto;
        let amortizacionTotal = [];
        let totalIntereses = 0;
        let totalCapital = 0;

        for (let i = 1; i <= cuotas; i++) {
            const intereses = saldoRestante * tasaMensual;
            const capital = cuotaFija - intereses;
            saldoRestante -= capital;

            amortizacionTotal.push({
                numeroCuota: i,
                fechaPago: dayjs().add(i, 'month').format('YYYY-MM-DD'),
                capital: capital,
                intereses: intereses,
                cuota: cuotaFija,
                saldoRestante: saldoRestante > 0 ? saldoRestante : 0,
            });

            totalIntereses += intereses;
            totalCapital += capital;
        }

        return { amortizacionTotal, totalIntereses, totalCapital };
    };

    useEffect(() => {
        if (monto && cuotas && tasa) {
            setCuotaFija(calcularCuotaFija(monto, cuotas, tasa)); // Calcula y guarda la cuota fija

            const { amortizacionTotal, totalIntereses, totalCapital } = calcularAmortizacion(monto, cuotas, tasa);
            setAmortizacion(amortizacionTotal);
            setTotalIntereses(totalIntereses);
            setTotalCapital(totalCapital);
        }
    }, [monto, cuotas, tasa]);

    return (
        <div>
            <h2 className="text-xl font-semibold m-auto">Resumen de la financiación</h2>
            <button onClick={onClose} className="text-sm text-red-500">Cerrar</button>

            <div className="mt-4">
                <h2 className="font-medium text-xl">Detalles</h2>
                <ul className="m-4">
                    <li className="pt-2"><strong>{lineaFinanciamiento.nombre}</strong> </li>
                    <li className="pt-2">Monto a financiar: <strong className="text-lg m-6">${monto}</strong></li>
                    <li className="pt-2">Cuota Mensual Fija: <strong>${cuotaFija.toFixed(2)}</strong> </li>
                    <li className="pt-2">Cuotas del prestamo: {cuotas} meses</li>
                    <li className="pt-2">Tasa de Interés Anual: {tasa}%</li>
                    <li className="pt-2">Entidad: {lineaFinanciamiento.entidad}</li>
                </ul>
            </div>

            <button 
                onClick={openModal}
                className="mt-4 p-2 bg-blue-500 text-white rounded-md"
            >
                Calcular financiamiento
            </button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Financiación"
                ariaHideApp={false}
                className="p-8 max-w-4xl mx-auto my-32 border-gray-400 border-2 bg-white"
            >
                <PresupuestoFinanciado
                    monto={monto} // Usamos monto en lugar de montoAFinanciar
                    cuotas={cuotas} // Usamos cuotas en lugar de cuotas[0]?.numeroCuotas
                    tasa={tasa} // Usamos tasa en lugar de selectedLinea.TNA
                    cuotaFija={cuotaFija.toFixed(2)}
                    vehiculo={vehiculo}
                    onClose={closeModal}
                />
            </Modal>
 
 {/*
            <div className="mt-4">
                <h3 className="font-medium">Amortización</h3>
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="border-b p-2">Cuota</th>
                            <th className="border-b p-2">Fecha de pago</th>
                            <th className="border-b p-2">Capital</th>
                            <th className="border-b p-2">Intereses</th>
                            <th className="border-b p-2">Total</th>
                            <th className="border-b p-2">Saldo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {amortizacion.map((cuota) => (
                            <tr key={cuota.numeroCuota}>
                                <td className="border-b p-2">{cuota.numeroCuota}</td>
                                <td className="border-b p-2">{cuota.fechaPago}</td>
                                <td className="border-b p-2">${cuota.capital.toFixed(2)}</td>
                                <td className="border-b p-2">${cuota.intereses.toFixed(2)}</td>
                                <td className="border-b p-2">${cuota.cuota.toFixed(2)}</td>
                                <td className="border-b p-2">${cuota.saldoRestante.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4">
                <h3 className="font-medium">Totales</h3>
                <ul>
                    <li><strong>Total Capital:</strong> ${totalCapital.toFixed(2)}</li>
                    <li><strong>Total Intereses:</strong> ${totalIntereses.toFixed(2)}</li>
                    <li><strong>Total a pagar:</strong> ${(totalCapital + totalIntereses).toFixed(2)}</li>
                </ul>
            </div>
            */}
        </div>
    );
};

export default VehiculoFinanciado;
