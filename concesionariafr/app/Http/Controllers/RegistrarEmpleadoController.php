<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;



class RegistrarEmpleadoController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('RegistrarEmpleado');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
        public function store(Request $request): RedirectResponse
    {
        // Validar los campos adicionales como lastname, direccion, dni, etc.
        $request->validate([
            'name' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'dni' => 'required|string|lowercase||max:255|unique:'.User::class,
            'phone' => 'required|string|lowercase||max:255|unique:'.User::class,
        ]);

        // Crear el usuario con los nuevos campos
        $user = User::create([
            'name' => $request->name,
            'lastname' => $request->lastname,
            'email' => $request->email,
            'dni' => $request->dni,
            'phone' => $request->phone,
            'password' => Hash::make($request->dni),
            'activo' => true, 
        ])->assignRole('empleado');

        event(new Registered($user));

        return redirect(route('dashboard', absolute: false));
    }
}