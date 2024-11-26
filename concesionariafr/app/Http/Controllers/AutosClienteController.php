<?php

namespace App\Http\Controllers;

use App\Models\AutosCliente;
use App\Models\User; // Asegúrate de importar el modelo User para clientes
use App\Models\Vehiculo; // Asegúrate de importar el modelo Vehiculo
use Illuminate\Http\Request;
use Inertia\Inertia;

class AutosClienteController extends Controller
{

    public function index($clienteId)
    {
        $favoritos = AutosCliente::where('idCliente', $clienteId)
            ->with('vehiculo')  // Asumimos que el modelo AutosCliente tiene una relación con Vehiculo
            ->get();

        return Inertia::render('Vehiculos/Vehiculo', [
            'favoritos' => $favoritos,
        ]);
    }
    public function store(Request $request)
    {
        $request->validate([
            'vehiculoId' => 'required|exists:vehiculos,id',
            'clienteId' => 'required|exists:users,id',
        ]);

        // Crear un nuevo registro en la tabla autos_cliente
        AutosCliente::create([
            'idCliente' => $request->clienteId,
            'idVehiculo' => $request->vehiculoId,
        ]);

        return response()->json(['message' => 'Vehículo agregado a favoritos.']);
    }

    public function destroy(Request $request)
    {
        $request->validate([
            'vehiculoId' => 'required|exists:vehiculos,id',
            'clienteId' => 'required|exists:users,id',
        ]);

        AutosCliente::where('idVehiculo', $request->vehiculoId)
            ->where('idCliente', $request->clienteId)
            ->delete();

        return response()->json(['message' => 'Vehículo eliminado de favoritos.']);
    }
}
