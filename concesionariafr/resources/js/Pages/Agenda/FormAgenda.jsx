import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, useForm, usePage } from "@inertiajs/react";
import dayjs from "dayjs";
import { useState } from "react";
import SearchClientes from "@/components/SearchClientes";

export default function FormAgenda({ currentEvent, closeModal }) {
    const user = usePage().props.auth.user;
    const { data, setData, post, put, processing, errors, reset } = useForm({
        titulo: currentEvent ? currentEvent.title : "",
        descripcion: currentEvent ? currentEvent.descripcion : "",
        fecha: currentEvent ? dayjs(currentEvent.start).format("YYYY-MM-DDTHH:mm") : "",
        idTipoEvento: currentEvent ? currentEvent.idTipoEvento : "",
        idEmpleado: user.id,
        idCliente: 1,
        idEstado: 4,
    });

    const [searchTerm, setSearchTerm] = useState("");

    const submit = (e) => {
        e.preventDefault();

        const newEvent = {
            titulo: data.titulo,
            descripcion: data.descripcion,
            fecha: data.fecha,
            idCliente: data.idCliente,
            idTipoEvento: data.idTipoEvento,
            idEmpleado: data.idEmpleado,
            idEstado: data.idEstado,
        };

        if (currentEvent && currentEvent.id) {
            // Si es un evento existente, actualizarlo usando 'put'
            put(route("agenda.update", currentEvent.id), {
                data: newEvent,
                onFinish: () => {
                    reset();
                    closeModal();
                },
            });
        } else {
            // Si es un nuevo evento, crearlo usando 'post'
            post(route("agenda.store"), {
                data: newEvent,
                onFinish: () => {
                    reset();
                    closeModal();
                },
            });
        }
    };

const deleteEvent = () => {
    if (currentEvent && currentEvent.id) {
        // Actualizar el evento para cambiar su idEstado (eliminar)
        put(route("agenda.update", currentEvent.id), {
            preserveScroll: true,
            data: { idEstado: 5 }, // Cambiar idEstado a 5 (o el valor correspondiente para "eliminado")
            onFinish: () => {
                reset();
                closeModal();
            },
            onError: (errors) => {
                console.error("Error al eliminar el evento:", errors);
            },
        });
    }
};

    const today = dayjs().format("YYYY-MM-DDTHH:mm");

    return (
        <div>
            <Head title={currentEvent ? "Editar Evento" : "Registrar Evento"} />
            <h2 className="m-5 p-5 text-center text-2xl text-orange-800">
                {currentEvent && currentEvent.id ? "Editar Evento" : "Registrar un Evento"}
            </h2>

            <form onSubmit={submit} autoComplete="off">
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

                <div className="mt-4">
                    <InputLabel htmlFor="idTipoEvento" value="Tipo de Evento" />
                    <select
                        id="idTipoEvento"
                        name="idTipoEvento"
                        value={data.idTipoEvento}
                        className="mt-1 block w-full"
                        onChange={(e) => setData("idTipoEvento", e.target.value)}

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

                <div className="flex items-center justify-end mt-4">
                    <PrimaryButton className="ml-4" processing={processing}>
                        {currentEvent && currentEvent.id ? "Actualizar" : "Crear Evento"}
                    </PrimaryButton>
                    {currentEvent && currentEvent.id && (
                        <button
                            type="button"
                            onClick={deleteEvent}
                            className="ml-4 text-red-600 underline"
                        >
                            Eliminar
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={closeModal}
                        className="ml-4 text-gray-600 underline"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}
