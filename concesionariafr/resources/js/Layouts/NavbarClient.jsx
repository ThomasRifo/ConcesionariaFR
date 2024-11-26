import NavLink from "@/components/NavLink";
import { Link } from "@inertiajs/react";
import React, { useState, useEffect } from "react";

const Navbar = ({ isBlackBg }) => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Si `isBlackBg` es true, el navbar tendrá el fondo negro
    const navbarBgClass =
        isBlackBg || isScrolled
            ? "bg-black"
            : "bg-white bg-opacity-5 backdrop-blur-sm";

    return (
        <header
            className={`fixed top-0 w-full z-50 duration-1000 ease-in-out ${navbarBgClass}`}
        >
            <nav className="container mx-auto px-4 py-4 flex items-center justify-between text-xl h-24">
            <a href={route("dashboard")} className="text-white font-bold text-4xl">
                    Logo
                </a>
                <div className="space-x-6">
                    <Link
                        href={route("home")}
                        className="text-white hover:text-gray-300 "
                    >
                        Inicio
                    </Link>
                    <Link
                        href={route("vehiculos.index")}
                        className="text-white hover:text-gray-300 "
                    >
                        Vehiculos
                    </Link>
                    <Link
                        href="#contact"
                        className="text-white hover:text-gray-300 "
                    >
                        Contacto
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
