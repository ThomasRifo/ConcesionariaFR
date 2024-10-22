<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehiculo extends Model
{
    use HasFactory;

    // Define la tabla asociada (opcional, si sigue la convención de nombres)
    protected $table = 'vehiculos';

    // Define los campos que son asignables en masa
    protected $fillable = [
    'idCategoria',
    'idCombustible',
    'idTransmision',
    'marca',
    'modelo',
    'anio',
    'precio',
    'patente',
    'color',
    'kilometraje',
    'idEstado',
    ];

    // Define las relaciones, si corresponde
    public function categoria()
    {
        return $this->belongsTo(categoriaVehiculo::class, 'idCategoria');
    }

    public function combustible()
    {
        return $this->belongsTo(Combustible::class, 'idCombustible');
    }

    public function transmision()
    {
        return $this->belongsTo(Transmision::class, 'idTransmision');
    }
}

