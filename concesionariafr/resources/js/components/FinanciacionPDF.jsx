import React from 'react';
import { Page, Text, View, Document, Image, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
    },
    section: {
        flexDirection: 'row',
        margin: 20,
        padding: 20,
    },
    imageContainer: {
        width: '45%',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 'auto',
    },
    infoContainer: {
        width: '50%',
        paddingLeft: 10,
        justifyContent: 'flex-start',
    },
    text: {
        fontSize: 12,
        marginBottom: 5,
    }
});

export default function Dashboard({ vehiculo, user }) {

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>

                    <View style={styles.infoContainer}>
                        <Text style={styles.text}>
                            {`${vehiculo?.marca} ${vehiculo?.modelo} ${vehiculo?.anio}`}
                        </Text>
                        <Text style={styles.text}>Cliente:</Text>
                        <Text style={styles.text}>{`${user?.name} ${user?.lastname}`}</Text>
                        <Text style={styles.text}>{user?.email}</Text>
                        <Text style={styles.text}>{user?.telefono}</Text>
                    </View>
                    <View style={styles.imageContainer}>
                        <Image
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSu-UcggDc1FJiuR9nW9Io2ACxF5j9Axq3U_A&s"
                            style={styles.image}
                        />
                    </View>
                </View>
            </Page>
        </Document>
    );
}
