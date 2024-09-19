<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PresupuestoFinanciado extends Model
{
    use HasFactory;

    // Nombre de la tabla en la base de datos
    protected $table = 'presupuesto_financiado';

    // Atributos que se pueden asignar masivamente
    protected $fillable = [
        'idFinanciamiento',
        'idPresupuesto',
    ];

    // Definición de la relación con el modelo Financiamiento
    public function financiamiento()
    {
        return $this->belongsTo(Financiamiento::class, 'idFinanciamiento');
    }

    // Definición de la relación con el modelo Presupuesto
    public function presupuesto()
    {
        return $this->belongsTo(Presupuesto::class, 'idPresupuesto');
    }
}
