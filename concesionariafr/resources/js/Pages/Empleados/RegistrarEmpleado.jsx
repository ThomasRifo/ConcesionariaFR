import GuestLayout2 from '@/Layouts/GuestLayout2';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function Register() {


    const user = usePage().props.auth.user;
    const isAdmin = user.roles.some((role) => role.name == "admin");

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        lastname: '',
        email: '',
        password: '',
        password_confirmation: '',
        activo: true, 
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('registeredEmployed'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };



    if (isAdmin) { 
    return (

                
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight justify-start">Registrar Empleado</h2>}
        >
    <GuestLayout2 >
            <Head title="Registrar Empleado" />
        
            <h2 className='m-5 p-5 text-center text-2xl text-orange-800'>Registrar un empleado</h2>
            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="Nombre" />

                    <TextInput
                        id="name"
                        name="name"
                        placeholder="Nombre del empleado"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="lastname" value="Apellido" />

                    <TextInput
                        id="lastname"
                        name="lastname"
                        placeholder="Nombre del empleado"
                        value={data.lastname}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        onChange={(e) => setData('lastname', e.target.value)}
                        required
                    />

                    <InputError message={errors.lastname} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="dni" value="DNI" />

                    <TextInput
                        id="dni"
                        name="dni"
                        value={data.dni}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('dni', e.target.value)}
                        required
                    />

                    <InputError message={errors.dni} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="phone" value="Teléfono" />

                    <TextInput
                        id="phone"
                        name="phone"
                        value={data.phone}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('phone', e.target.value)}
                        required
                    />

                    <InputError message={errors.phone} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="flex items-center justify-center mt-4">
                    <PrimaryButton disabled={processing}>
                        Registrar Empleado
                    </PrimaryButton>
                </div>
            </form>
            </GuestLayout2>
        </AuthenticatedLayout>
    );
    }
    return (
        <AuthenticatedLayout>
        <GuestLayout>
            <Head title="Acceso Denegado" />
            <div className="text-center mt-5 text-red-600">
                No tienes permisos para acceder a esta página.
            </div>
        </GuestLayout>
        </AuthenticatedLayout>
    );
}