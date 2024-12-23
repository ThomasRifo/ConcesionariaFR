import { useState } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, usePage } from "@inertiajs/react";
import DropdownIcon from "@/components/DropdownIcon";

export default function Authenticated({ header, children }) {
    const user = usePage().props.auth.user;
    const isAdmin = user.roles.some((role) => role.name == "admin");
    const isEmpleado = user.roles.some((role) => role.name == "empleado");
    

    const isAnyLinkActiveEmpleados = () => {
        return (
        route().current("registeredEmployed") ||
        route().current("empleados.edit")
        //|| route().current("profile.edit")  EJEMPLO PARA AGREGAR 1 O MAS RUTAS 
    )
    };

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <h2>Auto City</h2>
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route("dashboard")}
                                    active={route().current("dashboard")}
                                >
                                    Dashboard
                                </NavLink>
                                {(isAdmin || isEmpleado) && (
                                    <div className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300">
                                        <Dropdown className="h-full w-full">
                                            <Dropdown.Trigger className="h-full w-full">
                                                <span className="inline-flex rounded-md w-full h-full">
                                                    <button
                                                        type="button"
                                                        className="w-full h-full inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                                    >
                                                        Clientes
                                                    </button>
                                                </span>
                                            </Dropdown.Trigger>

                                            <Dropdown.Content>
                                                <Dropdown.Link
                                                    href={route("clientes.index")}
                                                    className={
                                                        route().current(
                                                            "clientes.index"
                                                        )
                                                            ? "border-b-2  bg-gray-200 text-indigo-800 focus:border-indigo-700"
                                                            : "focus:border-b-2 border-indigo-700"
                                                    }
                                                >
                                                    Lista de Clientes
                                                </Dropdown.Link>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>
                                )}
                                {isAdmin && (
                                    <div className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300">
                                        <Dropdown className="h-full w-full">
                                            <Dropdown.Trigger
                                                className={`w-full h-full ${
                                                    isAnyLinkActiveEmpleados()
                                                        ? "border-b-2 border-indigo-400 text-gray-900 focus:border-indigo-700 "
                                                        : ""
                                                }`}
                                            >
                                                <span className="inline-flex rounded-md w-full h-full">
                                                    <button
                                                        type="button"
                                                        className="w-full h-full inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                                    >
                                                        Empleados
                                                    </button>
                                                </span>
                                            </Dropdown.Trigger>

                                            <Dropdown.Content>
                                                <Dropdown.Link
                                                    href={route(
                                                        "registeredEmployed"
                                                    )}
                                                    className={
                                                        route().current(
                                                            "registeredEmployed"
                                                        )
                                                            ? "border-b-2  bg-gray-200 text-indigo-800 focus:border-indigo-700"
                                                            : "focus:border-b-2 border-indigo-700"
                                                    }
                                                >
                                                    Agregar empleado
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={route(
                                                        "empleados.index"
                                                    )}
                                                    className={
                                                        route().current(
                                                            "empleados.index"
                                                        )
                                                            ? "border-b-2  bg-gray-200 text-indigo-800 focus:border-indigo-700"
                                                            : "focus:border-b-2 border-indigo-700"
                                                    }
                                                >
                                                    Lista de Empleados
                                                </Dropdown.Link>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>
                                )}
                                {(isAdmin || isEmpleado) && (
                                    <div className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300">
                                        <Dropdown className="h-full w-full">
                                            <Dropdown.Trigger className="h-full w-full">
                                                <span className="inline-flex rounded-md w-full h-full">
                                                    <button
                                                        type="button"
                                                        className="w-full h-full inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                                    >
                                                        Vehículos
                                                    </button>
                                                </span>
                                            </Dropdown.Trigger>

                                            <Dropdown.Content>
                                                <Dropdown.Link
                                                    href={route("vehiculos.create")}
                                                    className={
                                                        route().current(
                                                            "vehiculos.create"
                                                        )
                                                            ? "border-b-2  bg-gray-200 text-indigo-800 focus:border-indigo-700"
                                                            : "focus:border-b-2 border-indigo-700"
                                                    }
                                                >
                                                    Agregar vehículo
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={route("vehiculos.edit")}
                                                    className={
                                                        route().current(
                                                            "vehiculos.edit"
                                                        )
                                                            ? "border-b-2  bg-gray-200 text-indigo-800 focus:border-indigo-700"
                                                            : "focus:border-b-2 border-indigo-700"
                                                    }
                                                >
                                                    Editar Vehiculo
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={route("vehiculos.index")}
                                                    as="button"
                                                >
                                                    Ver vehículos
                                                </Dropdown.Link>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>
                                )}
                                {(isAdmin || isEmpleado) && (
                                <NavLink
                                    href={route("agenda.index")}
                                    active={route().current("agenda.index")}
                                >
                                    Calendario
                                </NavLink>
                                )}

                                {/* <div className="hidden sm:flex sm:items-center sm:ms-6">
                            <div className="ms-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {user.name}


                                             
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route("profile.edit")}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div> */}
                            </div>
                        </div>


                     
                        <div className="hidden sm:flex sm:items-center sm:ms-6">
                            <div className="h-16">
                        <DropdownIcon></DropdownIcon>
                        </div>
                            <div className="ms-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">

                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {user.name}

                                                <svg
                                                    className="ms-2 -me-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route("profile.edit")}
                                        >
                                            Editar Perfil
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                        href={route("favoritos.list")}
                                        >
                                        Favoritos
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                        >
                                            Cerrar Sesión
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState
                                    )
                                }
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? "block" : "hidden") +
                        " sm:hidden"
                    }
                >
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink
                            href={route("dashboard")}
                            active={route().current("dashboard")}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800">
                                {user.name}
                            </div>
                            <div className="font-medium text-sm text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route("profile.edit")}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route("logout")}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
