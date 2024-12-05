<?php

namespace App\Http\Controllers;

use App\Models\AutosCliente;
use App\Models\User; // Asegúrate de importar el modelo User para clientes
use App\Models\Vehiculo; // Asegúrate de importar el modelo Vehiculo
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AutosClienteController extends Controller
{

    public function index()
    {
        $userId = Auth::id(); // ID del usuario autenticado
    
        $favoritos = AutosCliente::where('idCliente', $userId)
            ->pluck('idVehiculo')
            ->toArray(); // Solo obtenemos los IDs de los vehículos favoritos
    
        return response()->json([
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
    public function favoritos()
    {
        $userId = Auth::id();
    
         $vehiculo = Vehiculo::with(['imagenes', 'combustible', 'transmision', 'categoria']);
        // Obtén los favoritos ordenados y elimina duplicados por vehículo
        $favoritos = AutosCliente::where('idCliente', $userId)
            ->orderBy('id', 'desc') // Ordenar por el último registro agregado
            ->with(['vehiculo.imagenPrincipal', 'vehiculo.combustible', 'vehiculo.transmision', 'vehiculo.categoria']) 
            ->get()
            ->unique('idVehiculo') // Elimina duplicados basándose en el idVehiculo
            ->pluck('vehiculo');
    
        return Inertia::render('Vehiculos/VehiculosGuardados', [
            'vehiculos' => $favoritos,
        ]);

        
    }
}
