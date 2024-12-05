import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, useForm, usePage } from "@inertiajs/react";
import dayjs from "dayjs";

export default function AgendarCita({ closeModal, vehiculo }) {
    const { props } = usePage();
    const user = props.auth.user;

    if (!user) {
        window.location.href = route("login"); // Redirige al login si el usuario no está autenticado
        return null; // Evita renderizar el componente hasta que la redirección se complete
    }

    const titulo = vehiculo ? `${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.anio}` : "";
    const descripcion = vehiculo 
        ? `Hola, soy ${user.name} y estoy interesado en ver el vehículo ${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.anio} que se encuentra publicado en la web!` 
        : "";

    const { data, setData, post, processing, errors } = useForm({
        fecha: "",
        idCliente: user.id, 
        idEmpleado: 1, 
        idTipoEvento: 2, 
        idEstado: 1, 
        titulo: titulo, 
        descripcion: descripcion, 
    });

    // Función para manejar el envío del formulario
    const postHandler = (e) => {
        e.preventDefault();

        const newCita = {
            fecha: data.fecha, 
            idCliente: data.idCliente,
            idEmpleado: data.idEmpleado, 
            idTipoEvento: data.idTipoEvento, 
            idEstado: data.idEstado,
            titulo: data.titulo, 
            descripcion: data.descripcion, 
        };

        post(route("agenda.storeCita"), newCita, {
            onFinish: () => {
                closeModal();
            },
            onError: (errors) => {
                console.error(errors); 
                alert('Ocurrió un error al agendar la cita');
            },
        });
    };

    const today = dayjs().format("YYYY-MM-DD");

    return (
        <div>
            <Head title="Agendar Cita" />
            <h2 className="m-5 p-5 text-center text-2xl text-orange-800">Agendar Cita</h2>

            <form onSubmit={postHandler} autoComplete="off">
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
                    <InputLabel htmlFor="titulo" value="Título" />
                    <TextInput
                        id="titulo"
                        type="text"
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
                        type="text"
                        value={data.descripcion}
                        className="mt-1 block w-full"
                        onChange={(e) => setData("descripcion", e.target.value)} 
                        required
                    />
                    <InputError message={errors.descripcion} className="mt-2" />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <PrimaryButton processing={processing}>
                        Agendar
                    </PrimaryButton>
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
