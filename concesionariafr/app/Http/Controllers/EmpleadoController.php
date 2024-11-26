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



class EmpleadoController extends Controller
{
    /**
     * Display the registration view.
     */
    public function index()
    {

        $empleados = User::role('empleado')->with('ventas')->get();

        return Inertia::render('Empleados/Empleados', [
            'empleados' => $empleados
        ]);

    }
    
     public function create(): Response
    {
        return Inertia::render('Empleados/RegistrarEmpleado');

    }

    public function edit($id)
{
    $empleado = User::findOrFail($id);
    return response()->json($empleado);
}

public function update(Request $request, $id)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'lastname' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users,email,'.$id,
        'phone' => 'required|string|max:255|unique:users,phone,'.$id,
        'dni' => 'required|string|max:255|unique:users,dni,'.$id,
    ]);

    $empleado = User::findOrFail($id);
    $empleado->update($request->only('name', 'lastname', 'email', 'phone', 'dni'));

    return redirect()->back();
}

public function destroy($id)
{
    $empleado = User::findOrFail($id);

    // Elimina al usuario
    $empleado->delete();
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