
import { useState, useEffect } from "react";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";

export default function SearchClientes({ searchTerm, setSearchTerm, setData, errors }) {
    const [clientes, setClientes] = useState([]);
    const [selectedOptionIndex, setSelectedOptionIndex] = useState(-1);
    const [isFocused, setIsFocused] = useState(false); // Estado para controlar el foco

    const buscarClientes = async (email) => {
        if (email.length >= 2) {
            try {
                const response = await fetch(`/agenda/buscar-clientes?email=${email}`);
                if (!response.ok) {
                    throw new Error("Error al buscar clientes");
                }
                const data = await response.json();
                setClientes(data);
            } catch (error) {
                console.error("Error fetching clients:", error);
                setClientes([]); // Limpia en caso de error
            }
        } else {
            setClientes([]);
        }
    };

    useEffect(() => {
        buscarClientes(searchTerm);
        setSelectedOptionIndex(-1);
    }, [searchTerm]);

    const handleClienteSelect = (cliente) => {
        setData("idCliente", cliente.id);
        setSearchTerm(cliente.email); // Opcional: actualizar el campo de búsqueda
        setClientes([]); // Limpiar la lista de clientes
        setSelectedOptionIndex(-1); // Reiniciar el índice al seleccionar un cliente
    };

    const handleKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            setSelectedOptionIndex((prev) => Math.min(prev + 1, clientes.length - 1));
        } else if (e.key === "ArrowUp") {
            setSelectedOptionIndex((prev) => Math.max(prev - 1, 0));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (selectedOptionIndex >= 0 && selectedOptionIndex < clientes.length) {
                handleClienteSelect(clientes[selectedOptionIndex]);
            }
        }
    };

    return (
        <>
            <InputLabel htmlFor="idCliente" value="Cliente" />
            <TextInput
                id="idCliente"
                name="idCliente"
                placeholder="Buscar por email"
                className="mt-1 block w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                required
            />
            <ul className={`max-h-40 overflow-y-auto border ${isFocused ? 'border-gray-300' : 'border-transparent'} rounded mt-1`}>
                {clientes
                    .filter(cliente => cliente.email !== searchTerm)
                    .map((cliente, index) => (
                        <li
                            key={cliente.id}
                            onClick={() => handleClienteSelect(cliente)}
                            className={`cursor-pointer hover:bg-gray-200 p-2 ${selectedOptionIndex === index ? 'bg-gray-300' : ''}`}
                        >
                            {cliente.email} - {cliente.name} {cliente.lastname}
                        </li>
                    ))}
            </ul>
            <InputError message={errors.idCliente} className="mt-2" />
        </>
    );
}
