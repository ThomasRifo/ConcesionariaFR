<?php

namespace App\Http\Controllers;

use App\Models\AutosCliente;
use App\Models\Vehiculo;
use App\Models\categoriaVehiculo;
use App\Models\Combustible;
use App\Models\Transmision;
use App\Models\LineaFinanciamiento;
use App\Models\estadoVehiculo;
use App\Services\AutoDevService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;


class VehiculoController extends Controller
{
    protected $autoDevService;

    public function __construct(AutoDevService $autoDevService)
    {
        $this->autoDevService = $autoDevService;
    }

    public function index(Request $request)
    {
        // Obtener los parámetros de filtro de la solicitud
        $searchTerm = $request->input('searchTerm');
        $selectedMarcas = $request->input('selectedMarcas', []);
        $selectedModelos = $request->input('selectedModelos', []);
        $selectedCategoria = $request->input('selectedCategoria');
        $selectedCombustible = $request->input('selectedCombustible');
        $selectedTransmision = $request->input('selectedTransmision');
    
        // Iniciar la consulta de vehículos
        $query = Vehiculo::with('imagenes');
    
        // Aplicar filtros según los parámetros recibidos
        if ($searchTerm) {
            $query->where(function ($q) use ($searchTerm) {
                $q->where('marca', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('modelo', 'LIKE', "%{$searchTerm}%");
            });
        }
        if (!empty($selectedMarcas)) {
            $query->whereIn('marca', $selectedMarcas);
        }
        if (!empty($selectedModelos)) {
            $query->whereIn('modelo', $selectedModelos);
        }
        if ($selectedCategoria) {
            $query->where('idCategoria', $selectedCategoria);
        }
        if ($selectedCombustible) {
            $query->where('idCombustible', $selectedCombustible);
        }
        if ($selectedTransmision) {
            $query->where('idTransmision', $selectedTransmision);
        }
    
        // Obtener los vehículos filtrados
        $vehiculos = $query->get();
    
        // Obtener IDs de vehículos favoritos del usuario autenticado
        $favoritos = [];
        if (Auth::check()) {
            $favoritos = AutosCliente::where('idCliente', Auth::id())
                ->pluck('idVehiculo')
                ->toArray(); // Extraer los IDs de los vehículos favoritos
        }
    
        // Cargar los datos necesarios para la vista
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
            'favoritos' => $favoritos, // Pasar los IDs de favoritos al frontend
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
        'vin' => 'nullable|string|max:17|unique:vehiculos,vin',
        'pais_origen' => 'nullable|string|max:50',
        'tipo_motor' => 'nullable|string|max:50',
        'cilindrada' => 'nullable|string|max:20',
        'potencia' => 'nullable|string|max:20',
        'num_puertas' => 'nullable|integer',
        'color' => 'required|string|max:255',
        'kilometraje' => 'required|integer',
        'detalles' => 'nullable|string|max:300',
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
        'vin' => $request->vin,
        'pais_origen' => $request->pais_origen,
        'tipo_motor' => $request->tipo_motor,
        'cilindrada' => $request->cilindrada,
        'potencia' => $request->potencia,
        'num_puertas' => $request->num_puertas,
        'color' => $request->color,
        'kilometraje' => $request->kilometraje,
        'detalles' => $request->detalles,
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

    $favoritos = [];
    if (Auth::check()) {
        $favoritos = AutosCliente::where('idCliente', Auth::id())
            ->pluck('idVehiculo')
            ->toArray(); // Extraer los IDs de los vehículos favoritos
    }

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
        'favoritos' => $favoritos,
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
        'vin' => $request->vin ?? $vehiculo->vin,
        'pais_origen' => $request->pais_origen,
        'tipo_motor' => $request->tipo_motor,
        'cilindrada' => $request->cilindrada,
        'potencia' => $request->potencia,
        'num_puertas' => $request->num_puertas,
        'color' => $request->color,
        'kilometraje' => $request->kilometraje,
        'precio' => $request->precio,
        'detalles' => $request->detalles,
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

    /**
     * Busca información de un vehículo por VIN usando la API de Auto.dev
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function buscarPorVin(Request $request)
    {
        $request->validate([
            'vin' => 'required|string|max:17',
        ]);

        $vin = strtoupper(trim($request->vin)); // VIN en mayúsculas y sin espacios

        $resultado = $this->autoDevService->decodeVin($vin);

        if (isset($resultado['success']) && !$resultado['success']) {
            return response()->json([
                'success' => false,
                'message' => $resultado['error'] ?? 'No se pudo obtener información del vehículo.',
                'details' => $resultado['response'] ?? null,
                'status' => $resultado['status'] ?? null,
            ], $resultado['status'] ?? 500);
        }

        // Si tiene success true, retornar los datos
        if (isset($resultado['success']) && $resultado['success']) {
            unset($resultado['success']); 
            return response()->json([
                'success' => true,
                'data' => $resultado,
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $resultado,
        ]);
    }

}
