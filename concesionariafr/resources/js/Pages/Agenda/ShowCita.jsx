import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import NavbarClient from "@/Layouts/NavbarClient";
import TextInput from "@/Components/TextInput";
import { Head, usePage } from "@inertiajs/react";
import dayjs from "dayjs";

export default function ShowCita({ currentEvent }) {
    const { empleados } = usePage().props;

    const asesor = empleados.find(emp => emp.id === currentEvent?.idEmpleado);

    console.log(empleados);

    // Verificar que `empleados` y `currentEvent` estén definidos antes de usarlos

    return (
        <>
            <NavbarClient isBlackBg={true} />
            <div className="w-1/2 m-auto mt-60 p-10">
                <Head title="Detalle de la Cita" />
                <h2 className="m-5 p-5 text-center text-2xl text-orange-800">
                {currentEvent?.idEstado === 2 ? "Cita Reprogramada" : "Detalle de la Cita"}

                </h2>
                <form autoComplete="off">
                    {/* Título */}
                    <div>
                        <InputLabel htmlFor="titulo" value="Título" />
                        <TextInput
                            id="titulo"
                            name="titulo"
                            value={currentEvent?.title || ""}
                            className="mt-1 block w-full"
                            disabled
                        />
                        <InputError message="" className="mt-2" />
                    </div>

                    {/* Descripción */}
                    <div className="mt-4">
                        <InputLabel htmlFor="descripcion" value="Descripción" />
                        <TextInput
                            id="descripcion"
                            name="descripcion"
                            value={currentEvent?.descripcion || ""}
                            className="mt-1 block w-full"
                            disabled
                        />
                        <InputError message="" className="mt-2" />
                    </div>

                    {/* Fecha y Hora */}
                    <div className="mt-4">
                        <InputLabel htmlFor="fecha" value="Fecha y Hora" />
                        <TextInput
                            id="fecha"
                            name="fecha"
                            value={dayjs(currentEvent?.start).format("YYYY-MM-DD - HH:mm")}
                            className="mt-1 block w-full"
                            disabled
                        />
                        <InputError message="" className="mt-2" />
                    </div>

                    {/* Tipo de Evento */}
                    <div className="mt-4">
                        <InputLabel htmlFor="empleado" value="Asesor" />
                        <TextInput
                            id="empleado"
                            name="empleado"
                            value={asesor ? `${asesor.name} ${asesor.lastname}` : "Asesor no encontrado"}
                            className="mt-1 block w-full"
                            disabled
                        />
                        <InputError message="" className="mt-2" />
                    </div>
                </form>
                {currentEvent?.idEstado === 2 ? <div className="text-red-600 mt-8 text-xl m-center">En caso de no poder asistir al horario reprogramado, por favor avisar por whatsapp al <strong>2995724166</strong> para coordinar nueva fecha </div> : ""}
            </div>
        </>
    );
}
