<?php

namespace App\Http\Controllers;

use App\Models\CuotaFinanciamiento;
use App\Models\LineaFinanciamiento;
use Illuminate\Http\Request;

class CuotaFinanciamientoController extends Controller
{
    // Mostrar una lista de cuotas de financiamiento
    public function index()
    {
        $cuotas = CuotaFinanciamiento::with('lineaFinanciamiento')->get();
        return view('cuota_financiamiento.index', compact('cuotas'));
    }

    // Mostrar el formulario para crear una nueva cuota de financiamiento
    public function create()
    {
        $lineasFinanciamiento = LineaFinanciamiento::all();
        return view('cuota_financiamiento.create', compact('lineasFinanciamiento'));
    }

    // Almacenar una nueva cuota de financiamiento
    public function store(Request $request)
    {
        $request->validate([
            'idLineaFinanciamiento' => 'required|exists:linea_financiamiento,id',
            'numeroCuotas' => 'required|integer',
        ]);

        CuotaFinanciamiento::create($request->all());

        return redirect()->route('cuota_financiamiento.index')
                         ->with('success', 'Cuota de financiamiento creada exitosamente.');
    }

    // Mostrar los detalles de una cuota de financiamiento
    public function show(CuotaFinanciamiento $cuotaFinanciamiento)
    {
        return view('cuota_financiamiento.show', compact('cuotaFinanciamiento'));
    }

    // Mostrar el formulario para editar una cuota de financiamiento existente
    public function edit(CuotaFinanciamiento $cuotaFinanciamiento)
    {
        $lineasFinanciamiento = LineaFinanciamiento::all();
        return view('cuota_financiamiento.edit', compact('cuotaFinanciamiento', 'lineasFinanciamiento'));
    }

    // Actualizar una cuota de financiamiento existente
    public function update(Request $request, CuotaFinanciamiento $cuotaFinanciamiento)
    {
        $request->validate([
            'idLineaFinanciamiento' => 'required|exists:linea_financiamiento,id',
            'numeroCuotas' => 'required|integer',
        ]);

        $cuotaFinanciamiento->update($request->all());

        return redirect()->route('cuota_financiamiento.index')
                         ->with('success', 'Cuota de financiamiento actualizada exitosamente.');
    }

    // Eliminar una cuota de financiamiento existente
    public function destroy(CuotaFinanciamiento $cuotaFinanciamiento)
    {
        $cuotaFinanciamiento->delete();

        return redirect()->route('cuota_financiamiento.index')
                         ->with('success', 'Cuota de financiamiento eliminada exitosamente.');
    }
}
