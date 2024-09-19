<?php

namespace App\Http\Controllers;

use App\Models\AutosCliente;
use App\Models\User; // Asegúrate de importar el modelo User para clientes
use App\Models\Vehiculo; // Asegúrate de importar el modelo Vehiculo
use Illuminate\Http\Request;

class AutosClienteController extends Controller
{
    // Mostrar una lista de autos_cliente
    public function index()
    {
        $autosClientes = AutosCliente::with('cliente', 'vehiculo')->get();
        return view('autos_cliente.index', compact('autosClientes'));
    }

    // Mostrar el formulario para crear un nuevo auto_cliente
    public function create()
    {
        $clientes = User::all(); // Obtener todos los clientes
        $vehiculos = Vehiculo::all(); // Obtener todos los vehículos
        return view('autos_cliente.create', compact('clientes', 'vehiculos'));
    }

    // Almacenar un nuevo auto_cliente
    public function store(Request $request)
    {
        $request->validate([
            'idCliente' => 'required|exists:users,id',
            'idVehiculo' => 'required|exists:vehiculos,id',
        ]);

        AutosCliente::create($request->all());

        return redirect()->route('autos_cliente.index')
                         ->with('success', 'Auto Cliente creado exitosamente.');
    }

    // Mostrar los detalles de un auto_cliente
    public function show(AutosCliente $autosCliente)
    {
        return view('autos_cliente.show', compact('autosCliente'));
    }

    // Mostrar el formulario para editar un auto_cliente existente
    public function edit(AutosCliente $autosCliente)
    {
        $clientes = User::all(); // Obtener todos los clientes
        $vehiculos = Vehiculo::all(); // Obtener todos los vehículos
        return view('autos_cliente.edit', compact('autosCliente', 'clientes', 'vehiculos'));
    }

    // Actualizar un auto_cliente existente
    public function update(Request $request, AutosCliente $autosCliente)
    {
        $request->validate([
            'idCliente' => 'required|exists:users,id',
            'idVehiculo' => 'required|exists:vehiculos,id',
        ]);

        $autosCliente->update($request->all());

        return redirect()->route('autos_cliente.index')
                         ->with('success', 'Auto Cliente actualizado exitosamente.');
    }

    // Eliminar un auto_cliente existente
    public function destroy(AutosCliente $autosCliente)
    {
        $autosCliente->delete();

        return redirect()->route('autos_cliente.index')
                         ->with('success', 'Auto Cliente eliminado exitosamente.');
    }
}
