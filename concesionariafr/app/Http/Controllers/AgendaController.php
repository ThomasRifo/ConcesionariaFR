<?php

namespace App\Http\Controllers;

use App\Models\Agenda;
use Illuminate\Http\Request;

class AgendaController extends Controller
{
    // Mostrar una lista de agendas
    public function index()
    {
        $agendas = Agenda::with(['tipoEvento', 'empleado', 'cliente', 'estado'])->get();
        return view('agenda.index', compact('agendas'));
    }

    // Mostrar el formulario para crear una nueva agenda
    public function create()
    {
        // Aquí puedes pasar datos adicionales para los selectores, por ejemplo:
        // $tiposEventos = TipoEvento::all();
        // $empleados = User::where('role', 'empleado')->get();
        // $clientes = User::where('role', 'cliente')->get();
        // $estados = Estado::all();
        
        return view('agenda.create');
    }

    // Almacenar una nueva agenda
    public function store(Request $request)
    {
        $request->validate([
            'idTipoEvento' => 'required|exists:tipos_evento,id',
            'idEmpleado' => 'required|exists:users,id',
            'idCliente' => 'required|exists:users,id',
            'idEstado' => 'required|exists:estados,id',
            'titulo' => 'required|string|max:32',
            'fecha' => 'required|date',
            'descripcion' => 'nullable|string|max:250',
        ]);

        Agenda::create($request->all());

        return redirect()->route('agenda.index')
                         ->with('success', 'Evento creado exitosamente.');
    }

    // Mostrar los detalles de una agenda
    public function show(Agenda $agenda)
    {
        return view('agenda.show', compact('agenda'));
    }

    // Mostrar el formulario para editar una agenda existente
    public function edit(Agenda $agenda)
    {
        return view('agenda.edit', compact('agenda'));
    }

    // Actualizar una agenda existente
    public function update(Request $request, Agenda $agenda)
    {
        $request->validate([
            'idTipoEvento' => 'required|exists:tipos_evento,id',
            'idEmpleado' => 'required|exists:users,id',
            'idCliente' => 'required|exists:users,id',
            'idEstado' => 'required|exists:estados,id',
            'titulo' => 'required|string|max:32',
            'fecha' => 'required|date',
            'descripcion' => 'nullable|string|max:250',
        ]);

        $agenda->update($request->all());

        return redirect()->route('agenda.index')
                         ->with('success', 'Evento actualizado exitosamente.');
    }

    // Eliminar una agenda existente
    public function destroy(Agenda $agenda)
    {
        $agenda->delete();

        return redirect()->route('agenda.index')
                         ->with('success', 'Evento eliminado exitosamente.');
    }
}
