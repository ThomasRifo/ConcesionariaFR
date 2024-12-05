import React from 'react';
import { PhoneIcon} from '@heroicons/react/solid';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-gray-100 text-black py-12 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-semibold mb-4">AutoCity</h3>
                        <p className="text-sm flex items-center">
                            <PhoneIcon className="h-5 w-5 mr-2" />
                            0810 888 4000
                        </p>
                        <div className="mt-4">
                            <h4 className="text-lg font-semibold">Dirección</h4>
                            <p className="text-sm">Eugenio Perticone 2095, Q8300 Neuquén</p>
                        </div>
                    </div>

                    {/* Columna 2: Links */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Enlaces</h3>
                        <ul>
                            <li><a href="/" className="text-sm hover:text-gray-400">Inicio</a></li>
                            <li><a href="/vehiculos" className="text-sm hover:text-gray-400">Vehículos</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-4">Seguinos!</h3>
                        <div className="flex space-x-4">
                            <a href="https://www.facebook.com" className="text-xl hover:text-blue-600">
                                <FaFacebookF className="h-6 w-6" />
                            </a>
                            <a href="https://www.instagram.com" className="text-xl hover:text-pink-600">
                                <FaInstagram className="h-6 w-6" />
                            </a>
                            <a href="https://www.twitter.com" className="text-xl hover:text-blue-400">
                                <FaTwitter className="h-6 w-6" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center mt-8">
                <p className="text-sm">© 2024 ConcesionariaFR. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
}

