<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Agenda extends Model
{
    use HasFactory;

    // Nombre de la tabla en la base de datos
    protected $table = 'agenda';

    // Atributos que se pueden asignar masivamente
    protected $fillable = [
        'idTipoEvento',
        'idEmpleado',
        'idCliente',
        'idEstado',
        'titulo',
        'fecha',
        'descripcion',
    ];

    // Definición de la relación con el modelo TipoEvento
    public function tipoEvento()
    {
        return $this->belongsTo(TipoEvento::class, 'idTipoEvento');
    }

    // Definición de la relación con el modelo User (Empleado)
    public function empleado()
    {
        return $this->belongsTo(User::class, 'idEmpleado');
    }

    // Definición de la relación con el modelo User (Cliente)
    public function cliente()
    {
        return $this->belongsTo(User::class, 'idCliente');
    }

    // Definición de la relación con el modelo Estado
    public function estado()
    {
        return $this->belongsTo(EstadoEvento::class, 'idEstado');
    }
}
