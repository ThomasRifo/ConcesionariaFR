import React from 'react';
import { useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton'; // Componente personalizado
import TextInput from '@/Components/TextInput'; // Componente personalizado
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout2 from "@/Layouts/GuestLayout2";

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
        kilometraje: '',
        imagen: null,
    });

    const handleFileChange = (e) => {
        setData('imagen', e.target.files[0]);
    };

    const submit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });
        post(route('vehiculos.store'), {
            data: formData,
            forceFormData: true,
        });
    };

    return (
        <>
            <AuthenticatedLayout>
                <GuestLayout2>
                    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
                        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Registro Vehiculos</h2>
                        <form onSubmit={submit} className="space-y-6" method='POST' encType='multipart/form-data'>
                            {/* Select de Categoría */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Categoría</label>
                                <select
                                    value={data.idCategoria}
                                    onChange={(e) => setData('idCategoria', e.target.value)}
                                    className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
                                    className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
                                    className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
                                    className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {errors.marca && <span className="text-red-500 text-sm">{errors.marca}</span>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Modelo</label>
                                <TextInput
                                    value={data.modelo}
                                    onChange={(e) => setData('modelo', e.target.value)}
                                    className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {errors.modelo && <span className="text-red-500 text-sm">{errors.modelo}</span>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Año</label>
                                <TextInput
                                    value={data.anio}
                                    onChange={(e) => setData('anio', e.target.value)}
                                    className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {errors.anio && <span className="text-red-500 text-sm">{errors.anio}</span>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Precio</label>
                                <TextInput
                                    value={data.precio}
                                    onChange={(e) => setData('precio', e.target.value)}
                                    className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {errors.precio && <span className="text-red-500 text-sm">{errors.precio}</span>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Patente</label>
                                <TextInput
                                    value={data.patente}
                                    onChange={(e) => setData('patente', e.target.value)}
                                    className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {errors.patente && <span className="text-red-500 text-sm">{errors.patente}</span>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Color</label>
                                <TextInput
                                    value={data.color}
                                    onChange={(e) => setData('color', e.target.value)}
                                    className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {errors.color && <span className="text-red-500 text-sm">{errors.color}</span>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Kilometraje</label>
                                <TextInput
                                    value={data.kilometraje}
                                    onChange={(e) => setData('kilometraje', e.target.value)}
                                    className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {errors.kilometraje && <span className="text-red-500 text-sm">{errors.kilometraje}</span>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Imagen</label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="mt-2 block w-full text-sm text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {errors.imagen && <span className="text-red-500 text-sm">{errors.imagen}</span>}
                            </div>

                            <PrimaryButton className="w-full py-4 text-lg bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring focus:ring-indigo-200">
                                Agregar Vehículo
                            </PrimaryButton>
                        </form>
                    </div>
                </GuestLayout2>
            </AuthenticatedLayout>
        </>
    );
};

export default CreateVehiculo;
