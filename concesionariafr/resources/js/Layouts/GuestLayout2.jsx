import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex flex-col items-center pt-6 sm:pt-0 bg-gray-100">
            {/* Puedes descomentar el logo si lo necesitas */}
            {/* <div>
                <Link href="/">
                    <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" />
                </Link>
            </div> */}
            
            {/* Ajustando el contenedor */}
            <div className="w-full max-w-full mt-6 px-6 py-4 bg-white shadow-md overflow-x-auto sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
