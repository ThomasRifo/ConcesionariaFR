<?php

namespace App\Http\Controllers;

use App\Models\Financiamiento;
use App\Models\LineaFinanciamiento;
use Illuminate\Http\Request;

class FinanciamientoController extends Controller
{
    // Mostrar una lista de financiamientos
    public function index()
    {
        $financiamientos = Financiamiento::with('lineaFinanciamiento')->get();
        return view('financiamiento.index', compact('financiamientos'));
    }

    // Mostrar el formulario para crear un nuevo financiamiento
    public function create()
    {
        $lineasFinanciamiento = LineaFinanciamiento::all();
        return view('financiamiento.create', compact('lineasFinanciamiento'));
    }

    // Almacenar un nuevo financiamiento
    public function store(Request $request)
    {
        $request->validate([
            'idLineaFinanciamiento' => 'required|exists:linea_financiamiento,id',
            'montoFinanciado' => 'required|numeric',
            'cuotas' => 'required|integer',
            'montoCuota' => 'required|numeric',
        ]);

        Financiamiento::create($request->all());

        return redirect()->route('financiamiento.index')
                         ->with('success', 'Financiamiento creado exitosamente.');
    }

    // Mostrar los detalles de un financiamiento
    public function show(Financiamiento $financiamiento)
    {
        return view('financiamiento.show', compact('financiamiento'));
    }

    // Mostrar el formulario para editar un financiamiento existente
    public function edit(Financiamiento $financiamiento)
    {
        $lineasFinanciamiento = LineaFinanciamiento::all();
        return view('financiamiento.edit', compact('financiamiento', 'lineasFinanciamiento'));
    }

    // Actualizar un financiamiento existente
    public function update(Request $request, Financiamiento $financiamiento)
    {
        $request->validate([
            'idLineaFinanciamiento' => 'required|exists:linea_financiamiento,id',
            'montoFinanciado' => 'required|numeric',
            'cuotas' => 'required|integer',
            'montoCuota' => 'required|numeric',
        ]);

        $financiamiento->update($request->all());

        return redirect()->route('financiamiento.index')
                         ->with('success', 'Financiamiento actualizado exitosamente.');
    }

    // Eliminar un financiamiento existente
    public function destroy(Financiamiento $financiamiento)
    {
        $financiamiento->delete();

        return redirect()->route('financiamiento.index')
                         ->with('success', 'Financiamiento eliminado exitosamente.');
    }
}
