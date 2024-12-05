import React, { useEffect, useState, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function DropdownIcon() {
    const [isOpen, setIsOpen] = useState(false);
    const [realtimeNotifications, setRealtimeNotifications] = useState([]);
    const [localUnreadCount, setLocalUnreadCount] = useState(0); // Maneja el contador local de notificaciones
    const dropdownRef = useRef(null); // Referencia al dropdown
    const { props } = usePage();
    const { auth } = props;
    const unreadNotifications = auth.unreadNotifications;

    useEffect(() => {
        // Inicializa el contador con las notificaciones no leídas al cargar
        setLocalUnreadCount(auth.unreadNotificationsCount);
    }, [auth.unreadNotificationsCount]);

    // Maneja el cambio de estado al hacer clic
    const toggleDropdown = () => setIsOpen(!isOpen);

    // Cerrar el dropdown cuando se hace clic fuera de él
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Cargar sockets en el componente
    useEffect(() => {
        // Escuchar el canal privado del usuario
        const channel = Echo.private(`App.Models.User.${auth.user.id}`);

        channel.notification((notification) => {
            console.log('Nueva notificación recibida:', notification);

            setRealtimeNotifications((prev) => [notification, ...prev]);
            setLocalUnreadCount((prevCount) => prevCount + 1); // Incrementa el contador local
        });
        
        return () => {
            channel.unsubscribe();
        };
    }, [auth.user.id]);

    // Combinar notificaciones iniciales y nuevas
    const allNotifications = [...realtimeNotifications, ...unreadNotifications];

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="p-0 mt-4 rounded focus:outline-none focus:ring focus:ring-gray-400 relative"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path
                        fill="currentColor"
                        d="M4 19v-2h2v-7q0-2.075 1.25-3.687T10.5 4.2v-.7q0-.625.438-1.062T12 2t1.063.438T13.5 3.5v.7q2 .5 3.25 2.113T18 10v7h2v2zm8 3q-.825 0-1.412-.587T10 20h4q0 .825-.587 1.413T12 22m-4-5h8v-7q0-1.65-1.175-2.825T12 6T9.175 7.175T8 10z"
                    />
                </svg>
                {localUnreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1 -translate-y-1">
                        {localUnreadCount}
                    </span>
                )}
            </button>

            {isOpen && allNotifications.length > 0 && (
                <div className="absolute left-0 max-w-4xl mt-2 bg-white border border-gray-300 shadow-lg rounded-md z-50">
                    <ul className="max-h-80 overflow-y-auto">
                        {allNotifications.map((notification) => (
                            <Link key={notification.id} href={route('notificacion', { id: notification.id })} method="put">
                                <li
                                    className="px-4 h-24 w-80 py-2 text-sm text-gray-700 cursor-pointer border-b-2 border-black  hover:border-gray-300 hover:bg-gray-500 hover:text-white hover:text-lg transition-text duration-500"
                                >
                                    <p>Nueva cita para ver <strong className='text-base'> {notification?.data?.titulo || 'Nueva Notificación'} </strong></p>
                                </li>
                            </Link>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
