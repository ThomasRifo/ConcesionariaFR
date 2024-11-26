import React, { useState } from 'react';
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout2 from '@/Layouts/GuestLayout2';
import Modal from 'react-modal';
import Swal from 'sweetalert2';

const Empleados = ({ empleados }) => {
    const [selectedEmpleado, setSelectedEmpleado] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleEdit = (empleado) => {
        setSelectedEmpleado(empleado);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedEmpleado(null);
        setIsModalOpen(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        router.put(`/empleados/${selectedEmpleado.id}`, {
            name: formData.get('name'),
            lastname: formData.get('lastname'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            dni: formData.get('dni'),
        }, {
            onSuccess: () => {
                handleCloseModal();
            },
        });
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡Este cambio no podrá deshacerse!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminarlo',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/empleados/${id}`, {
                    onSuccess: () => {
                    },
                });
                Swal.fire(
                    '¡Eliminado!',
                    'El empleado ha sido eliminado.',
                    'success'
                );
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <GuestLayout2>
                <Head title="Empleados" />
                <div className="p-4">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Lista Empleados</h2>
                    {empleados.length ? (
                        <table className="table-auto w-full border-collapse border border-gray-200">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 px-4 py-2">Nombre</th>
                                    <th className="border border-gray-300 px-4 py-2">Apellido</th>
                                    <th className="border border-gray-300 px-4 py-2">Email</th>
                                    <th className="border border-gray-300 px-4 py-2">Teléfono</th>
                                    <th className="border border-gray-300 px-4 py-2">DNI</th>
                                    <th className="border border-gray-300 px-6 py-2">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {empleados.map((empleado) => (
                                    <tr key={empleado.id} className="hover:bg-gray-100">
                                        <td className="border border-gray-300 px-4 py-2">{empleado.name}</td>
                                        <td className="border border-gray-300 px-4 py-2">{empleado.lastname}</td>
                                        <td className="border border-gray-300 px-4 py-2">{empleado.email}</td>
                                        <td className="border border-gray-300 px-4 py-2">{empleado.phone}</td>
                                        <td className="border border-gray-300 px-4 py-2">{empleado.dni}</td>
                                        <td className="border border-gray-300 px-6 py-2 flex space-x-4">
                                            <button 
                                                onClick={() => handleEdit(empleado)} 
                                                className="bg-white text-black border border-black px-3 py-1 rounded transition-all duration-300 hover:bg-black hover:text-white"
                                            >
                                                Editar
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(empleado.id)} 
                                                className="bg-white text-black border border-black px-3 py-1 rounded transition-all duration-300 hover:bg-black hover:text-white"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No se encontraron empleados.</p>
                    )}
                </div>

                {/* Modal para editar empleado */}
                <Modal 
                    isOpen={isModalOpen} 
                    onRequestClose={handleCloseModal}
                    contentLabel="Editar Empleado"
                    className="bg-white p-6 rounded shadow-md w-1/3 mx-auto mt-20"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                >
                    {selectedEmpleado && (
                        <form onSubmit={handleSubmit}>
                            <h2 className="text-xl font-bold mb-4">Editar Empleado</h2>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Nombre</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    defaultValue={selectedEmpleado.name} 
                                    className="border border-gray-300 rounded px-3 py-2 w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Apellido</label>
                                <input 
                                    type="text" 
                                    name="lastname" 
                                    defaultValue={selectedEmpleado.lastname} 
                                    className="border border-gray-300 rounded px-3 py-2 w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Email</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    defaultValue={selectedEmpleado.email} 
                                    className="border border-gray-300 rounded px-3 py-2 w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Teléfono</label>
                                <input 
                                    type="text" 
                                    name="phone" 
                                    defaultValue={selectedEmpleado.phone} 
                                    className="border border-gray-300 rounded px-3 py-2 w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">DNI</label>
                                <input 
                                    type="text" 
                                    name="dni" 
                                    defaultValue={selectedEmpleado.dni} 
                                    className="border border-gray-300 rounded px-3 py-2 w-full"
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={handleCloseModal} className="bg-gray-500 text-white px-4 py-2 rounded">
                                    Cancelar
                                </button>
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                                    Guardar
                                </button>
                            </div>
                        </form>
                    )}
                </Modal>
            </GuestLayout2>
        </AuthenticatedLayout>
    );
};

export default Empleados;
