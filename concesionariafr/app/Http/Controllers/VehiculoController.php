<?php

namespace App\Http\Controllers;

use App\Models\Vehiculo;
use App\Models\categoriaVehiculo;
use App\Models\Combustible;
use App\Models\Transmision;
use App\Models\LineaFinanciamiento;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;


class VehiculoController extends Controller
{

    public function index()
    {

        $vehiculos = Vehiculo::all();
        $marcas = Vehiculo::select('marca')->distinct()->get();
        $modelos = Vehiculo::select('modelo')->distinct()->get();
        $categorias = categoriaVehiculo::all();
        $combustibles = Combustible::all();
        $transmisiones = Transmision::all();

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

    public function show($marca, $modelo, $anio)
    {
        // Buscar el vehículo usando los parámetros de marca, modelo y año
        $vehiculo = Vehiculo::where('marca', $marca)
            ->where('modelo', $modelo)
            ->where('anio', $anio)
            ->firstOrFail();

        $lineasFinanciamiento = LineaFinanciamiento::with('cuotas')->get();

        // Retornar la vista con los detalles del vehículo
        return Inertia::render('Vehiculos/VehiculoDetalle', [
            'vehiculo' => $vehiculo,
            'lineasFinanciamiento' => $lineasFinanciamiento,
        ]);
    }


}
