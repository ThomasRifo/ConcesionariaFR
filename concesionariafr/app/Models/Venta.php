<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Venta extends Model
{
    use HasFactory;

    protected $table = 'ventas'; // Si el nombre de la tabla es diferente del nombre del modelo en plural

    // Define los atributos que se pueden asignar masivamente
    protected $fillable = [
        'idVehiculo',
        'idEmpleado',
        'idCliente',
        'fechaVenta',
        'montoTotal',
    ];

    // Relaciones con otros modelos
    public function vehiculo()
    {
        return $this->belongsTo(Vehiculo::class, 'idVehiculo');
    }

    public function empleado()
    {
        return $this->belongsTo(User::class, 'idEmpleado');
    }

    public function cliente()
    {
        return $this->belongsTo(User::class, 'idCliente');
    }
}
