import React from 'react';
import { Page, Text, View, Document, Image, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
    },
    section: {
        margin: 20,
        padding: 20,
        flexGrow: 1
    },
    image: {
        width: '33%',
        height: 'auto',
    },
    infoContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingLeft: 10,
        width: '33%',
    },
    text: {
        fontSize: 12,
    }
});

const imagenBase64 = "data:image/jpeg;base64, /9j/4AAQSkZJRgABAQEAAAAAAAD..."; // imagen convertida a base64

const FinanciacionPDF = ({ vehiculo, user }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Image 
                    src={imagenBase64} 
                    style={styles.image} 
                />
                <View style={styles.infoContainer}>
                    <Text style={styles.text}>
                        {`${vehiculo?.marca} ${vehiculo?.modelo} ${vehiculo?.anio}`}
                    </Text>
                    <Text style={styles.text}>Cliente:</Text>
                    <Text style={styles.text}>{`${user?.name} ${user?.lastname}`}</Text>
                    <Text style={styles.text}>{user?.email}</Text>
                    <Text style={styles.text}>{user?.telefono}</Text>
                </View>
            </View>
        </Page>
    </Document>
);

export default FinanciacionPDF;