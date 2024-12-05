<?php

namespace App\Http\Controllers;

use App\Models\Agenda;
use App\Models\TipoEvento;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use App\Mail\CitaConfirmada;
use App\Mail\CitaReprogramada;
use Illuminate\Support\Facades\Mail;
use App\Notifications\NewNotification;
use Illuminate\Notifications\Notification;
use Spatie\Permission\Models\Role;


class AgendaController extends Controller
{
    public function index(): Response
    {

        $empleadoId = Auth::user()->id;
        // Obtener eventos y darles formato adecuado
        $agendas = Agenda::with('tipoEvento', 'empleado', 'cliente', 'estado') // Sin 'idEstado', ya que ya está incluido en la relación 'estado'
    ->whereIn('idEmpleado', [$empleadoId, 1])
    ->whereHas('estado', function ($query) {
        $query->where('id', '!=', 5); // Filtrar donde el idEstado no sea 5
    })
    ->orderBy('fecha', 'asc')
    ->get()
    ->map(function ($agenda) {
        $start = Carbon::parse($agenda->fecha);
        $end = $start->copy();

        switch ($agenda->tipoEvento->id) {
            case 1:
                $end->addHours(1);
                break;
            case 2:
                $end->addHours(1.5);
                break;
        }

        return [
            'id' => $agenda->id,
            'start' => $start->format('Y-m-d\TH:i:s'),
            'end' => $end->format('Y-m-d\TH:i:s'),
            'title' => $agenda->titulo,
            'descripcion' => $agenda->descripcion,
            'idTipoEvento' => $agenda->tipoEvento->id ?? null,
            'idEstado' => $agenda->estado->id ?? null, // Aquí tomamos el id del estado
        ];
    });

        $tiposEvento = TipoEvento::all();

        return Inertia::render('Agenda/Agenda', [
            'agendas' => $agendas,
            'tiposEvento' => $tiposEvento,
        ]);
        
    }
    /**
     * Store a newly created agenda event in storage.
     */
    public function store(Request $request)
{

    // Validar los campos
    $request->validate([
        'titulo' => 'required|string|max:32',
        'descripcion' => 'required|string|max:250',
        'fecha' => 'required|date',
        'idTipoEvento' => 'required|exists:tipo_evento,id',
        'idCliente' => 'required|exists:users,id',
        'idEstado' => 'required|integer|exists:estado_evento,id', // Validar como entero
    ]);

    // Crear el evento en la tabla 'agenda'
    $agenda = Agenda::create([
        'titulo' => $request->titulo,
        'descripcion' => $request->descripcion,
        'fecha' => $request->fecha,
        'idTipoEvento' => $request->idTipoEvento,
        'idEmpleado' => Auth::user()->id,
        'idCliente' => $request->idCliente,
        'idEstado' => $request->idEstado,
    ]);

    return Inertia::render('Agenda')->with('success', 'Evento creado con éxito.');
}

public function storeCita(Request $request)
{
    // Validar los campos
    $request->validate([
        'fecha' => 'required|date',
        'idCliente' => 'required|exists:users,id',
        'idEmpleado'=> 'required|exists:users,id',
        'idTipoEvento' => 'required|exists:tipo_evento,id',
        'idEstado' => 'required|exists:estado_evento,id',
        'titulo' => 'required|string|max:255',
        'descripcion' => 'required|string|max:1000',
    ]);

    // Crear el evento en la tabla 'agenda'
    $agenda = Agenda::create([
        'titulo' => $request->titulo,
        'descripcion' => $request->descripcion,
        'fecha' => $request->fecha,
        'idTipoEvento' => $request->idTipoEvento,
        'idEmpleado' => $request->idEmpleado,
        'idCliente' => Auth::user()->id,
        'idEstado' => $request->idEstado,
    ]);

    $empleados = User::role('empleado')->get(); // Spatie role permission
    $admins = User::role('admin')->get();       // Spatie role permission
    $tipo = 'nuevaCita';

    // Combinar empleados y admins
    $usuariosNotificados = $empleados->merge($admins);

    // Enviar notificación a cada usuario
    foreach ($usuariosNotificados as $usuario) {
        $usuario->notify(new \App\Notifications\NuevaCita(
            $agenda,
            $usuario,
            $tipo,
            ['database', 'broadcast']
        ));
    }



    return redirect()->route('vehiculos.index')->with('success', 'Evento creado con éxito.');
}

    public function buscarClientes(Request $request)
    {
        $email = $request->query('email');
        if ($email) {
            $clientes = User::where('email', 'like', "$email%")
                ->orWhere('email', 'like', "%$email")
                ->get();
            return response()->json($clientes);
        }
        return response()->json([]);
    }

    public function update(Request $request, $id)
    {
        
        $request->validate([
            'titulo' => 'required|string|max:32',
            'descripcion' => 'required|string|max:250',
            'fecha' => 'required|date',
            'idTipoEvento' => 'required|exists:tipo_evento,id',
            'idEstado' => 'required|exists:estado_evento,id',
        ]);
    
        $agenda = Agenda::findOrFail($id);
    
        $agenda->update([
            'titulo' => $request->titulo,
            'descripcion' => $request->descripcion,
            'fecha' => $request->fecha,
            'idTipoEvento' => $request->idTipoEvento,
            'idEstado' => $request->idEstado, 
            'idEmpleado' => Auth::user()->id, 
        ]);

        if($request->idEstado == 1){
                // Obtener los datos del cliente y del empleado
    $cliente = User::findOrFail($request->idCliente);
    $empleado = User::findOrFail($request->idEmpleado);
    $tipo = 'citaReprogramada';
    $agenda->update([
        'idEstado' => 2,
    ]);

    // Preparar los datos para enviar por correo
    $data = [
        'nombreCliente' => $cliente->name . ' ' . $cliente->lastname,
        'fecha' => $agenda->fecha,
        'descripcion' => $agenda->descripcion,
        'nombreEmpleado' => $empleado->name . ' ' . $empleado->lastname,
    ];


    // Enviar el correo
    Mail::to($cliente->email)->send(new CitaReprogramada($data));
        }

        
    $cliente->notify(new \App\Notifications\NuevaCita(
        $agenda,
        $cliente,
        $tipo,
        ['database', 'broadcast']
    ));
    
        return redirect()->route('agenda.index')->with('success', 'Evento actualizado con éxito.');
    }



    public function delete(Request $request, $id)
{
    // Validar que se proporciona un idEstado válido
    $request->validate([
        'idEstado' => 'required|exists:estado_evento,id',
    ]);

    // Buscar el evento
    $agenda = Agenda::findOrFail($id);

    // Actualizar el estado
    $agenda->update([
        'idEstado' => 5,
    ]);

    return redirect()->back()->with('success', 'Estado del evento actualizado con éxito.');
}


public function accept(Request $request, $id)
{
    // Validar que se proporciona un idEstado válido
    $request->validate([
        'idEstado' => 'required|exists:estado_evento,id',
    ]);

    // Buscar el evento
    $agenda = Agenda::findOrFail($id);

    // Actualizar el estado
    $agenda->update([
        'idEstado' => 3,
        'idEmpleado' => $request->user()->id,
    ]);

    // Obtener los datos del cliente y del empleado
    $cliente = User::findOrFail($request->idCliente);
    $empleado = User::findOrFail($request->idEmpleado);
    $tipo = 'citaAceptada';

    // Preparar los datos para enviar por correo
    $data = [
        'nombreCliente' => $cliente->name . ' ' . $cliente->lastname,
        'fecha' => $agenda->fecha,
        'descripcion' => $agenda->descripcion,
        'nombreEmpleado' => $empleado->name . ' ' . $empleado->lastname,
    ];

    // Enviar el correo
    Mail::to($cliente->email)->send(new CitaConfirmada($data));

    $cliente->notify(new \App\Notifications\NuevaCita(
        $agenda,
        $cliente,
        $tipo,
        ['database', 'broadcast']
    ));
    

    return redirect()->back()->with('success', 'Estado del evento actualizado con éxito.');
}

public function show($id)
{
    // Obtener el evento y las relaciones necesarias
    $agenda = Agenda::with(['cliente', 'empleado', 'tipoEvento', 'estado'])->findOrFail($id);

    // Obtener el usuario autenticado
    $user = auth()->user();

    // Verificar si el usuario es administrador o cliente, y si tiene acceso al evento
    $puedeAcceder = ($user->hasRole('admin') || $user->hasRole('empleado')) ;


    if (!$puedeAcceder) {
        abort(403, 'No tienes permiso para acceder a este evento.');
    }

    // Obtener tipos de eventos
    $tiposEvento = TipoEvento::all();

    // Retornar datos para el componente
    return inertia('Agenda/AgendaShow', [
        'currentEvent' => [
            'id' => $agenda->id,
            'title' => $agenda->titulo,
            'descripcion' => $agenda->descripcion,
            'start' => $agenda->fecha,
            'idTipoEvento' => $agenda->idTipoEvento,
            'idEmpleado' => $agenda->idEmpleado,
            'idCliente' => $agenda->idCliente,
            'idEstado' => $agenda->idEstado,
        ],
        'tiposEvento' => $tiposEvento,
    ]);
}


public function showCita($id)
{
    // Obtener el evento y las relaciones necesarias
    $agenda = Agenda::with(['cliente', 'empleado', 'tipoEvento', 'estado'])->findOrFail($id);

    // Obtener el usuario autenticado
    $user = auth()->user();

    // Verificar si el usuario es administrador o cliente, y si tiene acceso al evento
    $puedeAcceder = ($user->id == $agenda->idCliente);

    if (!$puedeAcceder) {
        abort(403, 'No tienes permiso para acceder a este evento.');
    }

    // Obtener tipos de eventos
    $tiposEvento = TipoEvento::all();

    // Obtener usuarios con el rol de 'empleado'
    $empleados = User::role('empleado')
    ->get(['id', 'name', 'lastname']); // Filtramos usuarios con rol 'empleado'

    // Retornar datos para el componente
    return inertia('Agenda/ShowCita', [
        'currentEvent' => [
            'id' => $agenda->id,
            'title' => $agenda->titulo,
            'descripcion' => $agenda->descripcion,
            'start' => $agenda->fecha,
            'idTipoEvento' => $agenda->idTipoEvento,
            'idEmpleado' => $agenda->idEmpleado,
            'idCliente' => $agenda->idCliente,
            'idEstado' => $agenda->idEstado,
        ],
        'tiposEvento' => $tiposEvento,
        'empleados' => $empleados,  // Pasamos los empleados filtrados
    ]);
}



}
