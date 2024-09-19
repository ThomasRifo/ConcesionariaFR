<?php

namespace App\Http\Controllers;

use App\Models\LineaFinanciamiento;
use Illuminate\Http\Request;

class LineaFinanciamientoController extends Controller
{
    // Mostrar una lista de líneas de financiamiento
    public function index()
    {
        $lineas = LineaFinanciamiento::all();
        return view('linea_financiamiento.index', compact('lineas'));
    }

    // Mostrar el formulario para crear una nueva línea de financiamiento
    public function create()
    {
        return view('linea_financiamiento.create');
    }

    // Almacenar una nueva línea de financiamiento
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:100',
            'entidad' => 'required|string|max:50',
            'capitalMax' => 'required|numeric',
            'TNA' => 'required|numeric',
            'CFT' => 'required|numeric',
        ]);

        LineaFinanciamiento::create($request->all());

        return redirect()->route('linea_financiamiento.index')
                         ->with('success', 'Línea de financiamiento creada exitosamente.');
    }

    // Mostrar los detalles de una línea de financiamiento
    public function show(LineaFinanciamiento $lineaFinanciamiento)
    {
        return view('linea_financiamiento.show', compact('lineaFinanciamiento'));
    }

    // Mostrar el formulario para editar una línea de financiamiento existente
    public function edit(LineaFinanciamiento $lineaFinanciamiento)
    {
        return view('linea_financiamiento.edit', compact('lineaFinanciamiento'));
    }

    // Actualizar una línea de financiamiento existente
    public function update(Request $request, LineaFinanciamiento $lineaFinanciamiento)
    {
        $request->validate([
            'nombre' => 'required|string|max:100',
            'entidad' => 'required|string|max:50',
            'capitalMax' => 'required|numeric',
            'TNA' => 'required|numeric',
            'CFT' => 'required|numeric',
        ]);

        $lineaFinanciamiento->update($request->all());

        return redirect()->route('linea_financiamiento.index')
                         ->with('success', 'Línea de financiamiento actualizada exitosamente.');
    }

    // Eliminar una línea de financiamiento existente
    public function destroy(LineaFinanciamiento $lineaFinanciamiento)
    {
        $lineaFinanciamiento->delete();

        return redirect()->route('linea_financiamiento.index')
                         ->with('success', 'Línea de financiamiento eliminada exitosamente.');
    }
}
