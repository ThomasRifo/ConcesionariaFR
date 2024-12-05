<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;

class ClienteController extends Controller
{
    
    public function index()
    {
        $clientes = User::role('cliente')->get();

        return Inertia::render('Clientes/Clientes', [
            'clientes' => $clientes
        ]);

    }

    public function edit($id)
    {
        $cliente = User::findOrFail($id);
        return response()->json($cliente);
    }

    public function update(Request $request, $id)
    {
    $request->validate([
        'name' => 'required|string|max:255',
        'lastname' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users,email,'.$id,
        'phone' => 'nullable|string|max:255|unique:users,phone,'.$id,
        'dni' => 'nullable|string|max:255|unique:users,dni,'.$id,
    ]);

    $cliente = User::findOrFail($id);
    $cliente->update($request->only('name', 'lastname', 'email', 'phone', 'dni'));

    return redirect()->back();
    }

    public function destroy($id)
    {
    $cliente = User::findOrFail($id);

    $cliente->delete();
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
