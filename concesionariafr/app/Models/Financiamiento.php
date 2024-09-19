<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Financiamiento extends Model
{
    use HasFactory;

    // Nombre de la tabla en la base de datos
    protected $table = 'financiamiento';

    // Atributos que se pueden asignar masivamente
    protected $fillable = [
        'idLineaFinanciamiento',
        'montoFinanciado',
        'cuotas',
        'montoCuota',
    ];

    // Definición de la relación con el modelo LineaFinanciamiento
    public function lineaFinanciamiento()
    {
        return $this->belongsTo(Lineafinanciamiento::class, 'idLineaFinanciamiento');
    }
}
