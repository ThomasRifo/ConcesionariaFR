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

    public function imagenes()
{
    return $this->hasMany(ImagenVehiculo::class, 'idVehiculo');
}

public function imagenPrincipal()
{
    return $this->hasOne(ImagenVehiculo::class, 'idVehiculo')->where('imagenPrincipal', true);
}

    public function categoria()
    {
        return $this->belongsTo(categoriaVehiculo::class, 'idCategoria');
    }

    public function estado()
    {
        return $this->belongsTo(estadoVehiculo::class, 'idEstado');
    }

    public function combustible()
    {
        return $this->belongsTo(Combustible::class, 'idCombustible');
    }

    public function transmision()
    {
        return $this->belongsTo(Transmision::class, 'idTransmision');
    }

    public function autosCliente()
{
    return $this->hasMany(AutosCliente::class, 'idVehiculo');
}
}

