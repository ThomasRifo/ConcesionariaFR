import { Link, Head } from '@inertiajs/react';
import NavbarClient from '@/Layouts/NavbarClient';
export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const handleImageError = () => {
        document.getElementById('screenshot-container')?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document.getElementById('docs-card-content')?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    return (
        <>
            <Head title="Vehículos" />
            <NavbarClient />
            <div className="h-2/3 h-[76vh] overflow-hidden">
                <img 
                    src="https://autocity.com.ar/wp-content/uploads/2022/01/autocity-seis-marcas.jpeg" 
                    className="w-full -mt-24 object-cover" 
                    alt="Imagen de autos"
                />
            </div>
           
        </>
    );
}
