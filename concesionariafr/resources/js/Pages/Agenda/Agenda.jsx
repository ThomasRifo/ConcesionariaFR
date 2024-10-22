import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import { useState } from "react";
import ReactModal from "react-modal";
import FormAgenda from "./FormAgenda";
import "dayjs/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";

dayjs.locale("es");

const customStyles = {
    overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
    },
    content: {
        width: "50%",
        height: "80%",
        margin: "auto",
        backgroundColor: "white",
        padding: "20px",
        position: "relative",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        zIndex: 1001,
    },
};

export default function Agenda() {
    const localizer = dayjsLocalizer(dayjs);
    const user = usePage().props.auth.user;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);

    const events = usePage().props.agendas.map((event) => ({
        id: event.id,
        start: dayjs(event.start).toDate(),
        end: dayjs(event.end).toDate(),
        title: event.title,
        descripcion: event.descripcion,
        idEstado: event.idEstado,

    }));

    const handleSelectSlot = (slotInfo) => {
        const now = new Date();
        if (slotInfo.start <= now) {
            return;
        }

        const newEvent = {
            id: null,
            title: "",
            descripcion: "",
            start: slotInfo.start,
            end: slotInfo.end,
        };
        setCurrentEvent(newEvent);
        setIsModalOpen(true);
    };

    const handleSelectEvent = (event) => {
        setCurrentEvent(event);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentEvent(null);
    };

    const dayPropGetter = (date) => {
        const currentDate = dayjs();
        const selectedDate = dayjs(date);

        if (selectedDate.isBefore(currentDate, "day")) {
            return {
                style: {
                    backgroundColor: "#ddd",
                    pointerEvents: "none",
                },
            };
        }
        return {};
    };

    console.log(events)
    const eventPropGetter = (event) => {
        let backgroundColor;
        let color;

        switch (event.idEstado) {
            case 5: // Estado 3
            backgroundColor = "lightblue"; // Color para estado 3
            color = "black"; // Color del texto
            break;
            case 2: // Estado 3
            backgroundColor = "lightblue"; // Color para estado 3
            color = "black"; // Color del texto
            break;
            case 3: // Estado 1
                backgroundColor = "lightgreen"; // Color para estado 1
                color = "black"; // Color del texto
                break;
            case 4: // Estado 2
                backgroundColor = "lightcoral"; // Color para estado 2
                color = "white"; // Color del texto
                break;
            case 5: // Estado 3
                backgroundColor = "lightblue"; // Color para estado 3
                color = "black"; // Color del texto
                break;
        }

        return {
            style: {
                backgroundColor,
                color,
                borderRadius: '5px', // Opcional: para bordes redondeados
                border: 'none', // Opcional: para quitar el borde
                padding: '10px', // Opcional: para padding interno
                display: 'block', // Asegúrate de que el evento se muestre como bloque
            },
        };
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight justify-start">
                    Calendario
                </h2>
            }
        >
            <Head title="Calendario" />
            <div className="">
                <div className="w-4/6 h-svh m-auto ">
                    <Calendar
                        selectable
                        messages={{
                            next: "Siguiente",
                            previous: "Anterior",
                            today: "Hoy",
                            month: "Mes",
                            week: "Semana",
                            day: "Día",
                        }}
                        localizer={localizer}
                        events={events}
                        defaultView={"week"}
                        dayPropGetter={dayPropGetter}
                        eventPropGetter={eventPropGetter} // Aquí se agrega
                        min={dayjs().set("hour", 8).set("minute", 0).toDate()}
                        max={dayjs().set("hour", 20).set("minute", 0).toDate()}
                        formats={{
                            dayHeaderFormat: (date) =>
                                dayjs(date).format("dddd - DD/MM"),
                        }}
                        onSelectSlot={handleSelectSlot}
                        onSelectEvent={handleSelectEvent}
                    />
                </div>
            </div>

            <ReactModal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel={
                    currentEvent && currentEvent.id
                        ? "Editar Evento"
                        : "Crear Evento"
                }
            >
                <button
                    onClick={closeModal}
                    className="absolute top-2 right-2 text-black text-2xl"
                >
                    &times;
                </button>

                <FormAgenda
                    currentEvent={currentEvent}
                    closeModal={closeModal}
                />
            </ReactModal>
        </AuthenticatedLayout>
    );
}
