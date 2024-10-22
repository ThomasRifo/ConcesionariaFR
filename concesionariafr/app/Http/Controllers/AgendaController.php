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

class AgendaController extends Controller
{
    public function index(): Response
    {

        $empleadoId = Auth::user()->id;
        // Obtener eventos y darles formato adecuado
        $agendas = Agenda::with('tipoEvento', 'empleado', 'cliente', 'estado',)
            ->whereIn('idEmpleado', [$empleadoId, 1])
            ->orderBy('fecha', 'asc')
            ->get()
            ->map(function ($agenda) {
                // Aseguramos que 'fecha' sea un objeto Carbon
                $start = Carbon::parse($agenda->fecha); // Convertir a Carbon
                $end = $start->copy(); // Copiamos el objeto start para modificarlo

                // Ajustar la duración según el tipo de evento
                switch ($agenda->tipoEvento->id) {
                    case 1: // Por ejemplo, evento tipo 1
                        $end->addHours(0.5); // 1 hora
                        break;
                    case 2: // Evento tipo 2
                        $end->addHours(1); // 2 horas
                        break;
                }


                return [
                    'id' => $agenda->id,
                    'start' => $start->format('Y-m-d\TH:i:s'), // Formato para el calendario
                    'end' => $end->format('Y-m-d\TH:i:s'), // Formato para el calendario
                    'title' => $agenda->titulo,
                    'descripcion' => $agenda->descripcion,
                ];
            });

        $tiposEvento = TipoEvento::all();

        return Inertia::render('Agenda/Agenda', [
            'agendas' => $agendas, // Pasamos los eventos formateados
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
            'idEstado' => 'required|exists:estado_evento,id',
        ]);

        // Crear el evento en la tabla 'agenda'
        $agenda = Agenda::create([
            'titulo' => $request->titulo,
            'descripcion' => $request->descripcion,
            'fecha' => $request->fecha,
            'idTipoEvento' => $request->idTipoEvento,
            'idEmpleado' => Auth::user()->id, // ID del empleado autenticado
            'idCliente' => $request->idCliente,
            'idEstado' => $request->idEstado,
        ]);

        // Redirigir al dashboard o donde necesites
        return Inertia::render('Agenda')->with('success', 'Evento creado con éxito.');
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
        // Validar los campos
        $request->validate([
            'titulo' => 'required|string|max:32',
            'descripcion' => 'required|string|max:250',
            'fecha' => 'required|date',
            'idTipoEvento' => 'required|exists:tipo_evento,id',
            'idCliente' => 'required|exists:users,id',
            'idEstado' => 'required|exists:estado_evento,id',
        ]);

        // Encontrar el evento existente por su ID
        $agenda = Agenda::findOrFail($id);

        // Actualizar los datos del evento
        $agenda->update([
            'titulo' => $request->titulo,
            'descripcion' => $request->descripcion,
            'fecha' => $request->fecha,
            'idTipoEvento' => $request->idTipoEvento,
            'idCliente' => $request->idCliente,
        ]);

        // Redirigir con un mensaje de éxito
        return redirect()->route('agenda.index')->with('success', 'Evento actualizado con éxito.');
    }
}
