<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LineaFinanciamiento extends Model
{

    public function cuotas()
    {
        return $this->hasMany(CuotaFinanciamiento::class, 'idLineaFinanciamiento');
    }

    use HasFactory;

    // Nombre de la tabla en la base de datos
    protected $table = 'linea_financiamiento';

    // Atributos que se pueden asignar masivamente
    protected $fillable = [
        'nombre',
        'entidad',
        'capitalMax',
        'TNA',
        'CFT',
    ];
}
