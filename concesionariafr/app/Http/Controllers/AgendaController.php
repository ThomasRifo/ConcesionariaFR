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
            'titulo' => 'required|string|max:255', // Agregar validación para el título
            'descripcion' => 'required|string|max:1000', // Agregar validación para la descripción
        ]);
    
        // Crear el evento en la tabla 'agenda'
        $agenda = Agenda::create([
            'titulo' => $request->titulo, // Usar el título del formulario
            'descripcion' => $request->descripcion, // Usar la descripción del formulario
            'fecha' => $request->fecha,
            'idTipoEvento' => $request->idTipoEvento,
            'idEmpleado' => $request->idEmpleado, // Cambia esto si necesitas usar otro id
            'idCliente' => Auth::user()->id,
            'idEstado' => $request->idEstado,
        ]);
    
        return Inertia::render('vehiculos.index')->with('success', 'Evento creado con éxito.');
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
    $cliente = User::findOrFail($request->idEmpleado);
    $empleado = User::findOrFail($request->idCliente);

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
        'idEmpleado' => $request->idEmpleado,
    ]);

    // Obtener los datos del cliente y del empleado
    $cliente = User::findOrFail($request->idEmpleado);
    $empleado = User::findOrFail($request->idCliente);

    // Preparar los datos para enviar por correo
    $data = [
        'nombreCliente' => $cliente->name . ' ' . $cliente->lastname,
        'fecha' => $agenda->fecha,
        'descripcion' => $agenda->descripcion,
        'nombreEmpleado' => $empleado->name . ' ' . $empleado->lastname,
    ];

    // Enviar el correo
    Mail::to($cliente->email)->send(new CitaConfirmada($data));

    return redirect()->back()->with('success', 'Estado del evento actualizado con éxito.');
}
}
