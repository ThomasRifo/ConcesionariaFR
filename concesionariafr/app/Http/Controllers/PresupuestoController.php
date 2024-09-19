<?php

namespace App\Http\Controllers;

use App\Models\Presupuesto;
use App\Models\Vehiculo;
use App\Models\User;
use Illuminate\Http\Request;

class PresupuestoController extends Controller
{
    // Mostrar una lista de presupuestos
    public function index()
    {
        $presupuestos = Presupuesto::with('vehiculo', 'empleado')->get();
        return view('presupuesto.index', compact('presupuestos'));
    }

    // Mostrar el formulario para crear un nuevo presupuesto
    public function create()
    {
        $vehiculos = Vehiculo::all();
        $empleados = User::all();
        return view('presupuesto.create', compact('vehiculos', 'empleados'));
    }

    // Almacenar un nuevo presupuesto
    public function store(Request $request)
    {
        $request->validate([
            'idVehiculo' => 'required|exists:vehiculos,id',
            'idEmpleado' => 'required|exists:users,id',
            'emailCliente' => 'required|email|max:50',
            'montoTotal' => 'required|numeric',
        ]);

        Presupuesto::create($request->all());

        return redirect()->route('presupuesto.index')
                         ->with('success', 'Presupuesto creado exitosamente.');
    }

    // Mostrar los detalles de un presupuesto
    public function show(Presupuesto $presupuesto)
    {
        return view('presupuesto.show', compact('presupuesto'));
    }

    // Mostrar el formulario para editar un presupuesto existente
    public function edit(Presupuesto $presupuesto)
    {
        $vehiculos = Vehiculo::all();
        $empleados = User::all();
        return view('presupuesto.edit', compact('presupuesto', 'vehiculos', 'empleados'));
    }

    // Actualizar un presupuesto existente
    public function update(Request $request, Presupuesto $presupuesto)
    {
        $request->validate([
            'idVehiculo' => 'required|exists:vehiculos,id',
            'idEmpleado' => 'required|exists:users,id',
            'emailCliente' => 'required|email|max:50',
            'montoTotal' => 'required|numeric',
        ]);

        $presupuesto->update($request->all());

        return redirect()->route('presupuesto.index')
                         ->with('success', 'Presupuesto actualizado exitosamente.');
    }

    // Eliminar un presupuesto existente
    public function destroy(Presupuesto $presupuesto)
    {
        $presupuesto->delete();

        return redirect()->route('presupuesto.index')
                         ->with('success', 'Presupuesto eliminado exitosamente.');
    }
}
