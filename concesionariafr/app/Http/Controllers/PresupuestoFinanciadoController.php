<?php

namespace App\Http\Controllers;

use App\Models\PresupuestoFinanciado;
use App\Models\Financiamiento;
use App\Models\Presupuesto;
use Illuminate\Http\Request;

class PresupuestoFinanciadoController extends Controller
{
    // Mostrar una lista de presupuesto financiado
    public function index()
    {
        $presupuestosFinanciados = PresupuestoFinanciado::with('financiamiento', 'presupuesto')->get();
        return view('presupuesto_financiado.index', compact('presupuestosFinanciados'));
    }

    // Mostrar el formulario para crear un nuevo presupuesto financiado
    public function create()
    {
        $financiamientos = Financiamiento::all();
        $presupuestos = Presupuesto::all();
        return view('presupuesto_financiado.create', compact('financiamientos', 'presupuestos'));
    }

    // Almacenar un nuevo presupuesto financiado
    public function store(Request $request)
    {
        $request->validate([
            'idFinanciamiento' => 'required|exists:financiamiento,id',
            'idPresupuesto' => 'required|exists:presupuesto,id',
        ]);

        PresupuestoFinanciado::create($request->all());

        return redirect()->route('presupuesto_financiado.index')
                         ->with('success', 'Presupuesto Financiado creado exitosamente.');
    }

    // Mostrar los detalles de un presupuesto financiado
    public function show(PresupuestoFinanciado $presupuestoFinanciado)
    {
        return view('presupuesto_financiado.show', compact('presupuestoFinanciado'));
    }

    // Mostrar el formulario para editar un presupuesto financiado existente
    public function edit(PresupuestoFinanciado $presupuestoFinanciado)
    {
        $financiamientos = Financiamiento::all();
        $presupuestos = Presupuesto::all();
        return view('presupuesto_financiado.edit', compact('presupuestoFinanciado', 'financiamientos', 'presupuestos'));
    }

    // Actualizar un presupuesto financiado existente
    public function update(Request $request, PresupuestoFinanciado $presupuestoFinanciado)
    {
        $request->validate([
            'idFinanciamiento' => 'required|exists:financiamiento,id',
            'idPresupuesto' => 'required|exists:presupuesto,id',
        ]);

        $presupuestoFinanciado->update($request->all());

        return redirect()->route('presupuesto_financiado.index')
                         ->with('success', 'Presupuesto Financiado actualizado exitosamente.');
    }

    // Eliminar un presupuesto financiado existente
    public function destroy(PresupuestoFinanciado $presupuestoFinanciado)
    {
        $presupuestoFinanciado->delete();

        return redirect()->route('presupuesto_financiado.index')
                         ->with('success', 'Presupuesto Financiado eliminado exitosamente.');
    }
}
