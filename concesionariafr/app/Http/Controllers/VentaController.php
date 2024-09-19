<?php

namespace App\Http\Controllers;

use App\Models\Venta;
use Illuminate\Http\Request;

class VentaController extends Controller
{
    // Mostrar una lista de ventas
    public function index()
    {
        $ventas = Venta::all();
        return view('ventas.index', compact('ventas'));
    }

    // Mostrar el formulario para crear una nueva venta
    public function create()
    {
        return view('ventas.create');
    }

    // Almacenar una nueva venta
    public function store(Request $request)
    {
        $request->validate([
            'idVehiculo' => 'required|exists:vehiculos,id',
            'idEmpleado' => 'required|exists:users,id',
            'idCliente' => 'required|exists:users,id',
            'fechaVenta' => 'required|date',
            'montoTotal' => 'required|numeric',
        ]);

        Venta::create($request->all());

        return redirect()->route('ventas.index')
                         ->with('success', 'Venta creada exitosamente.');
    }

    // Mostrar los detalles de una venta
    public function show(Venta $venta)
    {
        return view('ventas.show', compact('venta'));
    }

    // Mostrar el formulario para editar una venta existente
    public function edit(Venta $venta)
    {
        return view('ventas.edit', compact('venta'));
    }

    // Actualizar una venta existente
    public function update(Request $request, Venta $venta)
    {
        $request->validate([
            'idVehiculo' => 'required|exists:vehiculos,id',
            'idEmpleado' => 'required|exists:users,id',
            'idCliente' => 'required|exists:users,id',
            'fechaVenta' => 'required|date',
            'montoTotal' => 'required|numeric',
        ]);

        $venta->update($request->all());

        return redirect()->route('ventas.index')
                         ->with('success', 'Venta actualizada exitosamente.');
    }

    // Eliminar una venta existente
    public function destroy(Venta $venta)
    {
        $venta->delete();

        return redirect()->route('ventas.index')
                         ->with('success', 'Venta eliminada exitosamente.');
    }
}
