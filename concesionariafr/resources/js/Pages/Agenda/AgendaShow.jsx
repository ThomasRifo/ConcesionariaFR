import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, useForm, usePage } from "@inertiajs/react";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import SearchClientes from "@/components/SearchClientes";

export default function FormAgenda({ currentEvent, closeModal, handleEventChange }) {
    const user = usePage().props.auth.user;
    
    // Lógica para personalizar los campos 'titulo' y 'descripcion'
    console.log("soy currentEvent:", currentEvent); // Verifica si currentEvent tiene los datos correctos

    const { data, setData, post, put, processing, errors } = useForm({
        titulo: currentEvent ? currentEvent.title : "",
        descripcion: currentEvent ? currentEvent.descripcion : "",
        fecha: currentEvent ? dayjs(currentEvent.start).format("YYYY-MM-DDTHH:mm") : "",
        idTipoEvento: currentEvent ? currentEvent.idTipoEvento : "",
        idEstado: currentEvent && currentEvent.idEstado ? currentEvent.idEstado : 3,
        idEmpleado: currentEvent && currentEvent.idEmpleado && currentEvent.idEstado !== 1 
            ? currentEvent.idEmpleado 
            : user.id,
        idCliente: currentEvent && currentEvent.idCliente ? currentEvent.idCliente : 1,
    });

    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (currentEvent) {
            // Esto se ejecuta si `currentEvent` cambia, lo cual actualizará los datos del formulario
            setData({
                titulo: currentEvent.title,
                descripcion: currentEvent.descripcion,
                fecha: dayjs(currentEvent.start).format("YYYY-MM-DDTHH:mm"),
                idTipoEvento: currentEvent.idTipoEvento,
                idEstado: currentEvent.idEstado || 3,
                idEmpleado: currentEvent.idEmpleado || user.id,
                idCliente: currentEvent.idCliente || 1,
            });
        }
    }, [currentEvent]); // Asegura que se actualicen los datos del formulario cuando currentEvent cambie

    const submit = (e) => {
        e.preventDefault();

        console.log("Datos del formulario antes de enviar:", data);  // Verifica aquí los valores

        const newEvent = {
            titulo: data.titulo,
            descripcion: data.descripcion,
            start: data.fecha,
            end: dayjs(data.fecha).add(1, "hour").format("YYYY-MM-DDTHH:mm"),
            idCliente: data.idCliente,
            idTipoEvento: data.idTipoEvento,
            idEmpleado: data.idEmpleado,
            idEstado: data.idEstado,
        };

        if (currentEvent && currentEvent.id) {
            // Editar evento
            put(route("agenda.update", currentEvent.id), {
                data: newEvent,
                onSuccess: () => {
                    handleEventChange({ newEvent }); // Actualiza en el padre
                    closeModal(); // Cierra el modal tras éxito
                },
                onError: () => {
                    console.error("Error al actualizar el evento.");
                },
            });
        } else {
            // Crear evento
            post(route("agenda.store"), {
                data: newEvent,
                onSuccess: () => {
                    handleEventChange(newEvent); // Pasa el evento completo desde la respuesta
                    closeModal();
                },
                onError: (errors) => {
                    console.error("Errores al crear el evento:", errors);
                },
            });
        }
    };

    const handleDeleteEvent = (eventId) => {
        put(route("agenda.delete", eventId), {
            data: { idEstado: 5 },
            onSuccess: () => {
                handleEventChange({ id: eventId, idEstado: 5 }); // Marcado como eliminado
                closeModal();
            },
        });
    };

    const handleAcceptEvent = (eventId) => {
        put(route("agenda.accept", eventId), {
            data: { idEstado: 3 },
            onSuccess: () => {
                handleEventChange({ id: eventId, idEstado: 3, idEmpleado: user.id }); // Marcado como aceptado
                closeModal();
            },
        });
    };

    const today = dayjs().format("YYYY-MM-DDTHH:mm");

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight justify-start">
                    Editar Evento
                </h2>
            }
        >
        <div className="w-1/2 m-auto p-10">
            <Head title={currentEvent ? "Editar Evento" : "Registrar Evento"} />
            <h2 className="m-5 p-5 text-center text-2xl text-orange-800">
                {currentEvent && currentEvent.id ? "Editar Evento" : "Registrar un Evento"}
            </h2>
            {currentEvent && currentEvent.idEstado !== 1? (
    currentEvent.idEmpleado !== user.id ? (
        <div className="text-center text-red-600 text-lg">
            La cita ya fue aceptada por otro compañero.
        </div>
    ) : (
        <div className="text-center text-green-600 text-lg">
            Cita aceptada correctamente.
        </div>
    )
) : (
            <form onSubmit={submit} autoComplete="off">
                {/* Título */}
                <div>
                    <InputLabel htmlFor="titulo" value="Título" />
                    <TextInput
                        id="titulo"
                        name="titulo"
                        placeholder="Título del evento"
                        value={data.titulo}
                        className="mt-1 block w-full"
                        onChange={(e) => setData("titulo", e.target.value)}
                        required
                    />
                    <InputError message={errors.titulo} className="mt-2" />
                </div>

                {/* Descripción */}
                <div className="mt-4">
                    <InputLabel htmlFor="descripcion" value="Descripción" />
                    <TextInput
                        id="descripcion"
                        name="descripcion"
                        placeholder="Descripción del evento"
                        value={data.descripcion}
                        className="mt-1 block w-full"
                        onChange={(e) => setData("descripcion", e.target.value)}
                        required
                    />
                    <InputError message={errors.descripcion} className="mt-2" />
                </div>

                {/* Fecha y Hora */}
                <div className="mt-4">
                    <InputLabel htmlFor="fecha" value="Fecha y Hora" />
                    <TextInput
                        id="fecha"
                        type="datetime-local"
                        name="fecha"
                        value={data.fecha}
                        className="mt-1 block w-full"
                        onChange={(e) => setData("fecha", e.target.value)}
                        min={today}
                        required
                    />
                    <InputError message={errors.fecha} className="mt-2" />
                </div>

                {/* Tipo de Evento */}
                <div className="mt-4">
                    <InputLabel htmlFor="idTipoEvento" value="Tipo de Evento" />
                    <select
                        id="idTipoEvento"
                        name="idTipoEvento"
                        value={data.idTipoEvento}
                        onChange={(e) => setData("idTipoEvento", e.target.value)}
                        className="mt-1 block w-full"
                    >
                        <option value="">Selecciona un tipo de evento</option>
                        {usePage().props.tiposEvento.map((tipo) => (
                            <option key={tipo.id} value={tipo.id}>
                                {tipo.nombre}
                            </option>
                        ))}
                    </select>
                    <InputError message={errors.idTipoEvento} className="mt-2" />
                </div>

                {/* Buscar Cliente (opcional) */}
                {data.idTipoEvento === "2" && (
                    <div className="mt-4">
                        <SearchClientes
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            setData={setData}
                            errors={errors}
                        />
                    </div>
                )}

                {/* Botones */}
                <div className="flex items-center justify-end mt-4">
                    <PrimaryButton className="ml-4" processing={processing}>
                        {currentEvent && currentEvent.id ? "Actualizar" : "Crear Evento"}
                    </PrimaryButton>
                    {currentEvent && currentEvent.id && currentEvent.idEstado !== 1 && (
                        <button
                            type="button"
                            onClick={() => handleDeleteEvent(currentEvent.id)}
                            className="ml-4 text-red-600 underline"
                        >
                            Eliminar
                        </button>
                    )}
                    {currentEvent && currentEvent.id && currentEvent.idEstado === 1 && (
                        <button
                            type="button"
                            onClick={() => handleAcceptEvent(currentEvent.id)}
                            className="ml-4 text-red-600 underline"
                        >
                            Aceptar
                        </button>
                    )}
                </div>
            </form>
            )}
        </div>
        </AuthenticatedLayout>
    );

}
