<?php

namespace App\Http\Controllers;

use App\Models\Vehiculo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VehiculoController extends Controller
{

    public function index()
    {
        // Obtener todos los vehículos
        $vehiculos = Vehiculo::all();

        // Devolver la vista con los datos de los vehículos
        return Inertia::render('Vehiculos', [
            'vehiculos' => $vehiculos
        ]);
    }

    // Aquí puedes agregar más métodos como store(), update(), destroy(), etc.
    //
}
