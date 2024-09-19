<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImagenVehiculo extends Model
{
    use HasFactory;

    // Nombre de la tabla en la base de datos
    protected $table = 'imagen_vehiculo';

    // Atributos que se pueden asignar masivamente
    protected $fillable = [
        'idVehiculo',
        'urlImagen',
        'imagenPrincipal',
    ];

    // Definición de la relación con el modelo Vehiculo
    public function vehiculo()
    {
        return $this->belongsTo(Vehiculo::class, 'idVehiculo');
    }
}
