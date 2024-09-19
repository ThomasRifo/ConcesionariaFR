<?php

namespace App\Http\Controllers;

use App\Models\ImagenVehiculo;
use Illuminate\Http\Request;

class ImagenVehiculoController extends Controller
{
    // Mostrar una lista de imágenes de vehículos
    public function index()
    {
        $imagenes = ImagenVehiculo::with('vehiculo')->get();
        return view('imagen_vehiculo.index', compact('imagenes'));
    }

    // Mostrar el formulario para crear una nueva imagen de vehículo
    public function create()
    {
        return view('imagen_vehiculo.create');
    }

    // Almacenar una nueva imagen de vehículo
    public function store(Request $request)
    {
        $request->validate([
            'idVehiculo' => 'required|exists:vehiculos,id',
            'urlImagen' => 'required|string|max:200',
            'imagenPrincipal' => 'boolean',
        ]);

        ImagenVehiculo::create($request->all());

        return redirect()->route('imagen_vehiculo.index')
                         ->with('success', 'Imagen de vehículo creada exitosamente.');
    }

    // Mostrar los detalles de una imagen de vehículo
    public function show(ImagenVehiculo $imagenVehiculo)
    {
        return view('imagen_vehiculo.show', compact('imagenVehiculo'));
    }

    // Mostrar el formulario para editar una imagen de vehículo existente
    public function edit(ImagenVehiculo $imagenVehiculo)
    {
        return view('imagen_vehiculo.edit', compact('imagenVehiculo'));
    }

    // Actualizar una imagen de vehículo existente
    public function update(Request $request, ImagenVehiculo $imagenVehiculo)
    {
        $request->validate([
            'idVehiculo' => 'required|exists:vehiculos,id',
            'urlImagen' => 'required|string|max:200',
            'imagenPrincipal' => 'boolean',
        ]);

        $imagenVehiculo->update($request->all());

        return redirect()->route('imagen_vehiculo.index')
                         ->with('success', 'Imagen de vehículo actualizada exitosamente.');
    }

    // Eliminar una imagen de vehículo existente
    public function destroy(ImagenVehiculo $imagenVehiculo)
    {
        $imagenVehiculo->delete();

        return redirect()->route('imagen_vehiculo.index')
                         ->with('success', 'Imagen de vehículo eliminada exitosamente.');
    }
}
