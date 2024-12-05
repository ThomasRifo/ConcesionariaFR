import NavLink from "@/components/NavLink";
import Dropdown from "@/Components/Dropdown";
import { Link, usePage } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import DropdownIcon from "@/components/DropdownIcon";

const Navbar = ({ isBlackBg }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const user = usePage().props.auth.user;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const navbarBgClass =
        isBlackBg || isScrolled
            ? "bg-black"
            : "bg-white bg-opacity-5 backdrop-blur-sm";

    return (
        <header
            className={`fixed top-0 w-full z-50 duration-1000 ease-in-out ${navbarBgClass}`}
        >
            <nav className="container mx-auto px-4 py-4 flex items-center justify-between text-xl h-24">
                {/* Logo */}
                <a href={route("home")} className="text-white font-bold text-4xl">
                    <img
                        src="https://autocity.com.ar/wp-content/themes/ed-theme-child/assets/images/logo/logo.svg"
                        alt="Logo"
                    />
                </a>

                {/* Links de navegación */}
                <div className="space-x-6 flex items-center">
                    <Link
                        href={route("home")}
                        className="text-white hover:text-gray-300"
                    >
                        Inicio
                    </Link>
                    <Link
                        href={route("vehiculos.index")}
                        className="text-white hover:text-gray-300"
                    >
                        Vehiculos
                    </Link>
                    {!user && (
                        <>
                    <Link
                    href={route("login")}
                    className="text-gray-200 hover:text-gray-300 text-base justify-center"
                >
                    Iniciar Sesión
                </Link>
                                    <Link
                                    href={route("register")}
                                    className="text-white hover:text-gray-300 text-base justify-center"
                                >
                                    Registrarse
                                </Link>
                                </>
                    )}

                    {/* Dropdown con nombre de usuario */}
                    {user && (
                        <>
                                                    <div className=" pb-3">
                                <DropdownIcon></DropdownIcon>
                            </div>
                        <div className="relative">

                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-hiden hover:text-gray-300 focus:outline-none transition ease-in-out duration-150">
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
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link href={route("profile.edit")}>
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
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
