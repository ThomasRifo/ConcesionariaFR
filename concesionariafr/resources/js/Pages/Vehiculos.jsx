import VehiculosFilter from '@/components/VehiculoFilter';
import { Head } from '@inertiajs/react';
import React from 'react';



const Vehiculos = ({ vehiculos }) => {
    return (
        <>
        <Head title='Vehículos'/>
         <div>
            <h1>Lista de Vehículos</h1>
            <VehiculosFilter vehiculos={vehiculos} />
        </div>
        
        </>
    );
};

export default Vehiculos;