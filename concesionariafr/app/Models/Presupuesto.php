<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Presupuesto extends Model
{
    use HasFactory;

    // Nombre de la tabla en la base de datos
    protected $table = 'presupuesto';

    // Atributos que se pueden asignar masivamente
    protected $fillable = [
        'idVehiculo',
        'idEmpleado',
        'emailCliente',
        'montoTotal',
    ];

    // Definición de la relación con el modelo Vehiculo
    public function vehiculo()
    {
        return $this->belongsTo(Vehiculo::class, 'idVehiculo');
    }

    // Definición de la relación con el modelo Empleado (User)
    public function empleado()
    {
        return $this->belongsTo(User::class, 'idEmpleado');
    }
}
