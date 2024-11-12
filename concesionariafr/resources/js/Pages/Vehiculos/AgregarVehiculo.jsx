import React from 'react';
import { useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton'; // Componente personalizado
import TextInput from '@/Components/TextInput'; // Componente personalizado
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const CreateVehiculo = ({ categorias, combustibles, transmisiones }) => {
    const { data, setData, post, errors } = useForm({
        idCategoria: '',
        idCombustible: '',
        idTransmision: '',
        marca: '',
        modelo: '',
        anio: '',
        precio: '',
        patente: '',
        color: '',
        kilometraje: ''
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('vehiculos.store'));
    };

    return (
        <>
         <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight justify-start">Registrar Vehículo</h2>}
        >
        
            
        <div className="max-w-2xl mx-auto p-0 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">Crear Nuevo Vehículo</h2>
            <form onSubmit={submit} className="space-y-4">
                {/* Select de Categoría */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Categoría</label>
                    <select
                        value={data.idCategoria}
                        onChange={(e) => setData('idCategoria', e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">Selecciona una categoría</option>
                        {categorias.map((categoria) => (
                            <option key={categoria.id} value={categoria.id}>
                                {categoria.tipo}
                            </option>
                        ))}
                    </select>
                    {errors.idCategoria && <span className="text-red-500 text-sm">{errors.idCategoria}</span>}
                </div>

                {/* Select de Combustible */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Combustible</label>
                    <select
                        value={data.idCombustible}
                        onChange={(e) => setData('idCombustible', e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">Selecciona un combustible</option>
                        {combustibles.map((combustible) => (
                            <option key={combustible.id} value={combustible.id}>
                                {combustible.tipo}
                            </option>
                        ))}
                    </select>
                    {errors.idCombustible && <span className="text-red-500 text-sm">{errors.idCombustible}</span>}
                </div>

                {/* Select de Transmisión */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Transmisión</label>
                    <select
                        value={data.idTransmision}
                        onChange={(e) => setData('idTransmision', e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">Selecciona una transmisión</option>
                        {transmisiones.map((transmision) => (
                            <option key={transmision.id} value={transmision.id}>
                                {transmision.tipo}
                            </option>
                        ))}
                    </select>
                    {errors.idTransmision && <span className="text-red-500 text-sm">{errors.idTransmision}</span>}
                </div>

                {/* Otros campos del formulario */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Marca</label>
                    <TextInput
                        value={data.marca}
                        onChange={(e) => setData('marca', e.target.value)}
                        className="mt-1 block w-full"
                    />
                    {errors.marca && <span className="text-red-500 text-sm">{errors.marca}</span>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Modelo</label>
                    <TextInput
                        value={data.modelo}
                        onChange={(e) => setData('modelo', e.target.value)}
                        className="mt-1 block w-full"
                    />
                    {errors.modelo && <span className="text-red-500 text-sm">{errors.modelo}</span>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Año</label>
                    <TextInput
                        value={data.anio}
                        onChange={(e) => setData('anio', e.target.value)}
                        className="mt-1 block w-full"
                    />
                    {errors.anio && <span className="text-red-500 text-sm">{errors.anio}</span>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Precio</label>
                    <TextInput
                        value={data.precio}
                        onChange={(e) => setData('precio', e.target.value)}
                        className="mt-1 block w-full"
                    />
                    {errors.precio && <span className="text-red-500 text-sm">{errors.precio}</span>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Patente</label>
                    <TextInput
                        value={data.patente}
                        onChange={(e) => setData('patente', e.target.value)}
                        className="mt-1 block w-full"
                    />
                    {errors.patente && <span className="text-red-500 text-sm">{errors.patente}</span>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Color</label>
                    <TextInput
                        value={data.color}
                        onChange={(e) => setData('color', e.target.value)}
                        className="mt-1 block w-full"
                    />
                    {errors.color && <span className="text-red-500 text-sm">{errors.color}</span>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Kilometraje</label>
                    <TextInput
                        value={data.kilometraje}
                        onChange={(e) => setData('kilometraje', e.target.value)}
                        className="mt-1 block w-full"
                    />
                    {errors.kilometraje && <span className="text-red-500 text-sm">{errors.kilometraje}</span>}
                </div>

                <div className="mt-6">
                    <PrimaryButton type="submit" className="w-full py-2">
                        Crear Auto
                    </PrimaryButton>
                </div>
            </form>
        </div>
        </AuthenticatedLayout>
        </>
    );
};

export default CreateVehiculo;
