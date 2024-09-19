<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AutosCliente extends Model
{
    use HasFactory;

    // Nombre de la tabla en la base de datos
    protected $table = 'autos_cliente';

    // Atributos que se pueden asignar masivamente
    protected $fillable = [
        'idCliente',
        'idVehiculo',
    ];

    // Definición de la relación con el modelo Cliente
    public function cliente()
    {
        return $this->belongsTo(User::class, 'idCliente');
    }

    // Definición de la relación con el modelo Vehiculo
    public function vehiculo()
    {
        return $this->belongsTo(Vehiculo::class, 'idVehiculo');
    }
}
