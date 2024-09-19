<?php

namespace App\Http\Controllers;

use App\Models\Notificacion;
use Illuminate\Http\Request;

class NotificacionController extends Controller
{
    // Mostrar una lista de notificaciones
    public function index()
    {
        $notificaciones = Notificacion::all();
        return view('notificaciones.index', compact('notificaciones'));
    }

    // Mostrar el formulario para crear una nueva notificación
    public function create()
    {
        return view('notificaciones.create');
    }

    // Almacenar una nueva notificación
    public function store(Request $request)
    {
        $request->validate([
            'idEmpleado' => 'required|exists:users,id',
            'mensaje' => 'required|string',
            'fecha_envio' => 'required|date',
            'leido' => 'boolean',
        ]);

        Notificacion::create($request->all());

        return redirect()->route('notificaciones.index')
                         ->with('success', 'Notificación creada exitosamente.');
    }

    // Mostrar los detalles de una notificación
    public function show(Notificacion $notificacion)
    {
        return view('notificaciones.show', compact('notificacion'));
    }

    // Mostrar el formulario para editar una notificación existente
    public function edit(Notificacion $notificacion)
    {
        return view('notificaciones.edit', compact('notificacion'));
    }

    // Actualizar una notificación existente
    public function update(Request $request, Notificacion $notificacion)
    {
        $request->validate([
            'idEmpleado' => 'required|exists:users,id',
            'mensaje' => 'required|string',
            'fecha_envio' => 'required|date',
            'leido' => 'boolean',
        ]);

        $notificacion->update($request->all());

        return redirect()->route('notificaciones.index')
                         ->with('success', 'Notificación actualizada exitosamente.');
    }

    // Eliminar una notificación existente
    public function destroy(Notificacion $notificacion)
    {
        $notificacion->delete();

        return redirect()->route('notificaciones.index')
                         ->with('success', 'Notificación eliminada exitosamente.');
    }
}
