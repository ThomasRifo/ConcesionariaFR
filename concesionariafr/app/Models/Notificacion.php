<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notificacion extends Model
{
    use HasFactory;

    // Nombre de la tabla en la base de datos
    protected $table = 'notificaciones';

    // Atributos que se pueden asignar masivamente
    protected $fillable = [
        'idEmpleado',
        'mensaje',
        'fecha_envio',
        'leido',
    ];

    // Definición de la relación con el modelo User
    public function empleado()
    {
        return $this->belongsTo(User::class, 'idEmpleado');
    }
}
