<?php

namespace App\Http\Controllers;

use App\Models\Vehiculo;
use App\Models\categoriaVehiculo;
use App\Models\Combustible;
use App\Models\Transmision;
use App\Models\LineaFinanciamiento;
use App\Models\estadoVehiculo;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;


class VehiculoController extends Controller
{

    public function index()
    {
        $vehiculos = Vehiculo::with('imagenes')->get();
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

    public function destacados() {
        $vehiculos = Vehiculo::with('imagenes')->get();
        return Inertia::render('home', ['vehiculos' => $vehiculos]);
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
        'imagen' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    $vehiculo = Vehiculo::create([
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

    if ($request->hasFile('imagen')) {
        $path = $request->file('imagen')->store('imagenes', 'public');
        $vehiculo->imagenes()->create([
            'urlImagen' => $path,
            'imagenPrincipal' => true,
        ]);
    }

    return redirect()->route('vehiculos.index')->with('success', 'Auto creado exitosamente.');
}


public function show($marca, $modelo, $anio)
{
    // Buscar el vehículo con sus relaciones
    $vehiculo = Vehiculo::with(['imagenes', 'combustible', 'transmision', 'categoria'])
        ->where('marca', $marca)
        ->where('modelo', $modelo)
        ->where('anio', $anio)
        ->firstOrFail();

    $vehiculo->increment('cantidadVistas');

    $vehiculoDetalle = [
        'id' => $vehiculo->id,
        'marca' => $vehiculo->marca,
        'modelo' => $vehiculo->modelo,
        'anio' => $vehiculo->anio,
        'precio' => $vehiculo->precio,
        'kilometraje' => $vehiculo->kilometraje,
        'color' => $vehiculo->color,
        'patente' => $vehiculo->patente,
        'cantidadVistas' => $vehiculo->cantidadVistas,
        'categoria' => $vehiculo->categoria ? $vehiculo->categoria->tipo : 'No especificada',
        'combustible' => $vehiculo->combustible ? $vehiculo->combustible->tipo : 'No especificado',
        'transmision' => $vehiculo->transmision ? $vehiculo->transmision->tipo : 'No especificada',
        'imagenes' => $vehiculo->imagenes,
    ];

    $lineasFinanciamiento = LineaFinanciamiento::with('cuotas')->get();

    return Inertia::render('Vehiculos/VehiculoDetalle', [
        'vehiculo' => $vehiculoDetalle,
        'lineasFinanciamiento' => $lineasFinanciamiento,
    ]);
}

        public function edit()
    {
        $vehiculos = Vehiculo::with(['imagenes', 'combustible', 'transmision', 'categoria'])->get();
        $categorias = categoriaVehiculo::all();
        $combustibles = Combustible::all();
        $transmisiones = Transmision::all();
        $estados = estadoVehiculo::all();

        return Inertia::render('Vehiculos/EditarVehiculo', [
            'vehiculos' => $vehiculos,
            'categorias' => $categorias,
            'combustibles' => $combustibles,
            'transmisiones' => $transmisiones,
            'estados' => $estados,
        ]);
    }

    public function update(Request $request, $id)
{
    $vehiculo = Vehiculo::findOrFail($id);
    $vehiculo->update([
        'marca' => $request->marca,
        'modelo' => $request->modelo,
        'anio' => $request->anio,
        'patente' => $request->patente,
        'color' => $request->color,
        'kilometraje' => $request->kilometraje,
        'precio' => $request->precio,
        'idCategoria' => $request->idCategoria,
        'idCombustible' => $request->idCombustible,
        'idTransmision' => $request->idTransmision,
        'idEstado' => $request->idEstado,
    ]);

    return redirect()->route('vehiculos.edit')->with('success', 'Vehículo actualizado correctamente');
}


    public function destroy($id)
    {

    $vehiculo = Vehiculo::findOrFail($id);

    $vehiculo->delete();

    return redirect()->route('vehiculos.edit')->with('success', 'Vehículo eliminado exitosamente.');

    }

}
