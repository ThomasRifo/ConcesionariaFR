<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Agenda extends Model
{
    use HasFactory;

    protected $table = 'agenda';

    protected $fillable = [
        'titulo',
        'descripcion',
        'fecha',
        'idTipoEvento',
        'idEmpleado',
        'idCliente',
        'idEstado',
    ];

    // Relación con el empleado (usuario)
    public function empleado()
    {
        return $this->belongsTo(User::class, 'idEmpleado');
    }

    // Relación con el cliente (usuario)
    public function cliente()
    {
        return $this->belongsTo(User::class, 'idCliente');
    }

    // Relación con el tipo de evento
    public function tipoEvento()
    {
        return $this->belongsTo(TipoEvento::class, 'idTipoEvento');
    }

    // Relación con el estado del evento
    public function estado()
    {
        return $this->belongsTo(EstadoEvento::class, 'idEstado');
    }
}
