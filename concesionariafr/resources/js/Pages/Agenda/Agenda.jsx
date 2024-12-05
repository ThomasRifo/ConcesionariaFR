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


const CustomEvent = ({ event }) => {
    const getSVGByStatus = (status) => {
        switch (status) {
            case 1:
                return (
                    
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            minheight="32"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="currentColor"
                                d="M5 8h14V6H5zm0 0V6zm0 14q-.825 0-1.412-.587T3 20V6q0-.825.588-1.412T5 4h1V2h2v2h8V2h2v2h1q.825 0 1.413.588T21 6v5.675q-.475-.225-.975-.375T19 11.075V10H5v10h6.3q.175.55.413 1.05t.562.95zm13 1q-2.075 0-3.537-1.463T13 18t1.463-3.537T18 13t3.538 1.463T23 18t-1.463 3.538T18 23m1.675-2.625l.7-.7L18.5 17.8V15h-1v3.2z"
                            />
                        </svg>
                   
                );
            case 2:
                return (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fill="currentColor"
                            d="M5 6h14v2H5z"
                            opacity=".3"
                        />
                        <path
                            fill="currentColor"
                            d="M21 12V6c0-1.1-.9-2-2-2h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h7v-2H5V10h14v2zm-2-4H5V6h14zm-3.36 12a3.504 3.504 0 0 0 6.86-1c0-1.93-1.57-3.5-3.5-3.5c-.95 0-1.82.38-2.45 1H18V18h-4v-4h1.5v1.43c.9-.88 2.14-1.43 3.5-1.43c2.76 0 5 2.24 5 5a5.002 5.002 0 0 1-9.9 1z"
                        />
                    </svg>
                );
            case 3:
                return (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fill="currentColor"
                            d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 16H5V9h14zM5 7V5h14v2zm5.56 10.46l5.93-5.93l-1.06-1.06l-4.87 4.87l-2.11-2.11l-1.06 1.06z"
                        />
                    </svg>
                );
            case 4:
                return (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fill="currentColor"
                            d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 16H5V9h14zM5 7V5h14v2zm3.23 9.41l1.06 1.06l2.44-2.44l2.44 2.44l1.06-1.06l-2.44-2.44l2.44-2.44l-1.06-1.06l-2.44 2.44l-2.44-2.44l-1.06 1.06l2.44 2.44z"
                        />
                    </svg>
                );
            case 5:
                return <></>;

            default:
                return <></>;
        }
    };

    return (
<div className="max-h-10 flex items-center">
    {/* Contenedor para SVG y título */}
    <div className="flex items-center space-x-2">
        {/* SVG a la izquierda */}
        {getSVGByStatus(event.idEstado)}

        {/* Título a la derecha */}
        <span>{event.title}</span>
    </div>
</div>
    );
};

export default function Agenda() {
    const localizer = dayjsLocalizer(dayjs);
    const user = usePage().props.auth.user;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);

    const [events, setEvents] = useState(
        usePage().props.agendas.map((event) => ({
            id: event.id,
            start: dayjs(event.start).toDate(),
            end: dayjs(event.end).toDate(),
            title: event.title,
            descripcion: event.descripcion,
            idEstado: event.idEstado,
            idTipoEvento: event.idTipoEvento,
            idCliente: event.idCliente,
        }))
    );

    const handleEventChange = (updatedEvent) => {
    setEvents((prevEvents) => {
        if (updatedEvent.id) {
            // Si el evento existe, actualiza su información
            return prevEvents.map((event) =>
                event.id === updatedEvent.id ? updatedEvent : event
            );
        } else {
            // Si es un nuevo evento, añádelo
            return [...prevEvents, updatedEvent];
        }
    });
};

    /*const handleEventChange = (newEvent, isDelete = false) => {
        if (isDelete) {
            setEvents((prevEvents) =>
                prevEvents.filter((event) => event.id !== newEvent.id)
            );
        } else {
            setEvents((prevEvents) => {
                const existingEvent = prevEvents.find(
                    (event) => event.id === newEvent.id
                );
                if (existingEvent) {
                    return prevEvents.map((event) =>
                        event.id === newEvent.id ? newEvent : event
                    );
                } else {
                    return [...prevEvents, newEvent];
                }
            });
        }
    };*/

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




    return (
        <AuthenticatedLayout>
            <Head title="Calendario" />
            <div className="w-full">
            <h2 className="relative left-1/2 text-xl mb-16 mt-8">Agenda</h2>
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
                        min={dayjs().set("hour", 8).set("minute", 0).toDate()}
                        max={dayjs().set("hour", 20).set("minute", 0).toDate()}
                        formats={{
                            dayHeaderFormat: (date) =>
                                dayjs(date).format("dddd - DD/MM"),
                        }}
                        components={{
                            event: CustomEvent,
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
                    handleEventChange={handleEventChange}
                />
            </ReactModal>
            </div>
        </AuthenticatedLayout>
    );
}
