import React, { useState } from "react";

const VehiculosFilter = ({ vehiculos }) => {
    const [filteredVehiculos, setFilteredVehiculos] = useState(vehiculos);
    const [searchTerm, setSearchTerm] = useState("");

    const handleFilter = (event) => {
        const { value } = event.target;
        setSearchTerm(value);

        const filtered = vehiculos.filter((vehiculo) => 
            vehiculo.marca.toLowerCase().includes(value.toLowerCase()) ||
            vehiculo.modelo.toLowerCase().includes(value.toLowerCase())
        );

        setFilteredVehiculos(filtered);
    };

    return (
        <div>
            <input 
                type="text" 
                placeholder="Buscar por marca o modelo" 
                value={searchTerm}
                onChange={handleFilter}
            />
            <ul>
                {filteredVehiculos.map((vehiculo) => (
                    <li key={vehiculo.id}>
                        {vehiculo.marca} {vehiculo.modelo} - {vehiculo.anio}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default VehiculosFilter;