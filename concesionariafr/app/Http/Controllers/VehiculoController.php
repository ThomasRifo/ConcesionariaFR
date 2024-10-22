<?php

namespace App\Http\Controllers;

use App\Models\Vehiculo;
use App\Models\categoriaVehiculo;
use App\Models\Combustible;
use App\Models\Transmision;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VehiculoController extends Controller
{

public function index(Request $request)
{
    // Obtén los valores de los filtros y la búsqueda desde la solicitud
    $searchTerm = $request->input('search');
    $selectedMarcas = $request->input('marcas', []);
    $selectedModelos = $request->input('modelos', []);
    $selectedCategoria = $request->input('categoria');
    $selectedCombustible = $request->input('combustible');
    $selectedTransmision = $request->input('transmision');

    // Consulta base de vehículos
    $query = Vehiculo::query();

    // Filtrar por búsqueda
    if ($searchTerm) {
        $query->where(function ($q) use ($searchTerm) {
            $q->where('marca', 'like', "%{$searchTerm}%")
              ->orWhere('modelo', 'like', "%{$searchTerm}%");
        });
    }

    // Filtrar por marcas seleccionadas
    if (!empty($selectedMarcas)) {
        $query->whereIn('marca', $selectedMarcas);
    }

    // Filtrar por modelos seleccionados
    if (!empty($selectedModelos)) {
        $query->whereIn('modelo', $selectedModelos);
    }

    // Filtrar por categoría
    if ($selectedCategoria) {
        $query->where('idCategoria', $selectedCategoria);
    }

    // Filtrar por combustible
    if ($selectedCombustible) {
        $query->where('idCombustible', $selectedCombustible);
    }

    // Filtrar por transmisión
    if ($selectedTransmision) {
        $query->where('idTransmision', $selectedTransmision);
    }

    // Obtener los vehículos filtrados
    $vehiculos = $query->get();

    // Obtener marcas, modelos, categorías, etc. para los filtros
    $marcas = Vehiculo::select('marca')->distinct()->get();
    $modelos = Vehiculo::select('modelo')->distinct()->get();
    $categorias = categoriaVehiculo::all();
    $combustibles = Combustible::all();
    $transmisiones = Transmision::all();

    // Devolver los resultados con Inertia
    return Inertia::render('Vehiculos/Vehiculos', [
        'vehiculos' => $vehiculos,
        'marcas' => $marcas,
        'modelos' => $modelos,
        'categorias' => $categorias,
        'combustibles' => $combustibles,
        'transmisiones' => $transmisiones,
    ]);
}



    public function create()
    {
        $categorias = categoriaVehiculo::all();

        $combustibles = Combustible::all();

        $transmisiones = Transmision::all();
        
        return Inertia::render('Vehiculos/AgregarVehiculo', [
            'categorias' => $categorias,
            'combustibles' => $combustibles,
            'transmisiones' => $transmisiones,
        ]);
    }

    public function store(Request $request)
{
    $request->validate([
        'idCategoria' => 'required|integer',
        'idCombustible' => 'required|integer',
        'idTransmision' => 'required|integer',
        'marca' => 'required|string|max:255',
        'modelo' => 'required|string|max:255',
        'anio' => 'required|integer',
        'precio' => 'required|numeric',
        'patente' => 'required|string|max:255',
        'color' => 'required|string|max:255',
        'kilometraje' => 'required|integer',
    ]);

    Vehiculo::create([
        'idCategoria' => $request->idCategoria,
        'idCombustible' => $request->idCombustible,
        'idTransmision' => $request->idTransmision,
        'marca' => $request->marca,
        'modelo' => $request->modelo,
        'anio' => $request->anio,
        'precio' => $request->precio,
        'patente' => $request->patente,
        'color' => $request->color,
        'kilometraje' => $request->kilometraje,
        'idEstado' => 1,
    ]);

    return redirect()->route('vehiculos.index')->with('success', 'Auto creado exitosamente.');
}


}
