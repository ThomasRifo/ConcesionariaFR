import React, { useMemo } from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import dayjs from "dayjs";

// Estilos para el PDF
const styles = StyleSheet.create({
    page: { padding: 30, fontSize: 10 },
    section: { marginBottom: 10 },
    table: { display: 'table', width: '100%', borderStyle: 'solid', borderWidth: 1, borderColor: '#000' },
    tableRow: { flexDirection: 'row' },
    tableCell: { flex: 1, borderStyle: 'solid', borderWidth: 1, borderColor: '#000', padding: 4 },
    title: { fontSize: 14, marginBottom: 10, fontWeight: 'bold' },
    totals: { marginTop: 10, fontWeight: 'bold' },
});

// Función para calcular la cuota fija
const calcularCuotaFija = (monto, cuotas, tasa) => {
    const tasaMensual = tasa / 100 / 12;
    return (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -cuotas));
};

// Función para calcular la tabla de amortización
const calcularAmortizacion = (monto, cuotas, tasa) => {
    const tasaMensual = tasa / 100 / 12;
    const cuotaFija = calcularCuotaFija(monto, cuotas, tasa);

    let saldoRestante = monto;
    const amortizacionTotal = [];
    let totalIntereses = 0;
    let totalCapital = 0;

    for (let i = 1; i <= cuotas; i++) {
        const intereses = saldoRestante * tasaMensual;
        const capital = cuotaFija - intereses;
        saldoRestante -= capital;

        amortizacionTotal.push({
            numeroCuota: i,
            fechaPago: dayjs().add(i, 'month').format('YYYY-MM-DD'),
            capital: capital.toFixed(2),
            intereses: intereses.toFixed(2),
            cuota: cuotaFija.toFixed(2),
            saldoRestante: saldoRestante > 0 ? saldoRestante.toFixed(2) : '0.00',
        });

        totalIntereses += intereses;
        totalCapital += capital;
    }

    return { amortizacionTotal, totalIntereses, totalCapital };
};

export default function FinanciacionPDF({
    vehiculo,
    user,
    monto,
    cuotas,
    tasa,
    lineaFinanciamientoNombre,
    lineaFinanciamientoEntidad,
}) {
    // Calcula la tabla de amortización
    const { amortizacionTotal, totalIntereses, totalCapital } = useMemo(() => calcularAmortizacion(monto, cuotas, tasa), [
        monto,
        cuotas,
        tasa,
    ]);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text style={styles.title}>Simulación de financiación</Text>
                    <Text>Cliente: {user.name}</Text>
                    <Text>Vehículo: {vehiculo.marca} {vehiculo.modelo}</Text>
                    <Text>Precio: $ {new Intl.NumberFormat('es-ES').format(vehiculo.precio)}</Text>
                    <Text>Monto a financiar: $ {new Intl.NumberFormat('es-ES').format(monto)}</Text>
                    <Text>Cuota fija mensual: $ {calcularCuotaFija(monto, cuotas, tasa).toFixed(2)}</Text>
                    <Text>Cuotas: {cuotas} meses</Text>
                    <Text>TNA: {tasa}%</Text>
                    <Text>Línea de financiamiento: {lineaFinanciamientoNombre || 'No especificada'}</Text>
                    <Text>Entidad: {lineaFinanciamientoEntidad || 'No especificada'}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.title}>Tabla de Amortización</Text>
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Cuota</Text>
                            <Text style={styles.tableCell}>Fecha</Text>
                            <Text style={styles.tableCell}>Capital</Text>
                            <Text style={styles.tableCell}>Intereses</Text>
                            <Text style={styles.tableCell}>Total</Text>
                            <Text style={styles.tableCell}>Saldo</Text>
                        </View>
                        {amortizacionTotal.map((cuota) => (
                            <View key={cuota.numeroCuota} style={styles.tableRow}>
                                <Text style={styles.tableCell}>{cuota.numeroCuota}</Text>
                                <Text style={styles.tableCell}>{cuota.fechaPago}</Text>
                                <Text style={styles.tableCell}>$ {cuota.capital}</Text>
                                <Text style={styles.tableCell}>$ {cuota.intereses}</Text>
                                <Text style={styles.tableCell}>$ {cuota.cuota}</Text>
                                <Text style={styles.tableCell}>$ {cuota.saldoRestante}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.totals}>
                    <Text>Total Capital Pagado: $ {totalCapital.toFixed(2)}</Text>
                    <Text>Total Intereses Pagados: $ {totalIntereses.toFixed(2)}</Text>
                    <Text>Total a Pagar: $ {(totalCapital + totalIntereses).toFixed(2)}</Text>
                </View>
            </Page>
        </Document>
    );
}
