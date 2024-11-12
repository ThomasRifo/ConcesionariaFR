import React, { useState, useEffect } from "react";
import dayjs from "dayjs";  // Asegúrate de tener esta librería instalada

const VehiculoFinanciado = ({ monto, cuotas, tasa, onClose }) => {
    const [amortizacion, setAmortizacion] = useState([]);
    const [totalIntereses, setTotalIntereses] = useState(0);
    const [totalCapital, setTotalCapital] = useState(0);

    // Función para calcular la amortización francesa
    const calcularAmortizacion = (monto, cuotas, tasa) => {
        const tasaMensual = tasa / 100 / 12; // Convertimos la tasa anual a mensual
        const cuotaFija = (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -cuotas)); // Calculamos la cuota fija

        let saldoRestante = monto;
        let amortizacionTotal = [];
        let totalIntereses = 0;
        let totalCapital = 0;

        // Calculamos cada cuota
        for (let i = 1; i <= cuotas; i++) {
            const intereses = saldoRestante * tasaMensual; // Intereses de la cuota
            const capital = cuotaFija - intereses; // Capital amortizado en la cuota
            saldoRestante -= capital; // Reducimos el saldo restante

            amortizacionTotal.push({
                numeroCuota: i,
                fechaPago: dayjs().add(i, 'month').format('YYYY-MM-DD'),  // Usamos dayjs para la fecha
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

    // Ejecutar el cálculo de amortización al recibir datos
    useEffect(() => {
        if (monto && cuotas && tasa) {
            const { amortizacionTotal, totalIntereses, totalCapital } = calcularAmortizacion(monto, cuotas, tasa);
            setAmortizacion(amortizacionTotal);
            setTotalIntereses(totalIntereses);
            setTotalCapital(totalCapital);
        }
    }, [monto, cuotas, tasa]);

    return (
        <div>
            <h2 className="text-xl font-semibold">Resumen de la financiación</h2>
            <button onClick={onClose} className="text-sm text-red-500">Cerrar</button>

            <div className="mt-4">
                <h3 className="font-medium">Detalles del préstamo</h3>
                <ul>
                    <li><strong>Monto a financiar:</strong> ${monto}</li>
                    <li><strong>Cuotas:</strong> {cuotas} meses</li>
                    <li><strong>Tasa de Interés Anual:</strong> {tasa}%</li>
                </ul>
            </div>

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
        </div>
    );
};

export default VehiculoFinanciado;
