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
            <Head title="Concesionaria FR" />
            <div className='h-full'></div>
            <div>asfasfsa</div>
            <NavbarClient></NavbarClient>
           
        </>
    );
}
