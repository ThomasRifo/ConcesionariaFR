<?php

namespace App\Models\External;

use Illuminate\Database\Eloquent\Model;

/**
 * Modelo para acceder a las cuotas de financiamiento en la base de datos externa
 */
class CuotaFinanciamientoExterna extends Model
{
    // Especificar la conexión a la base de datos externa
    protected $connection = 'bancos';
    
    // Nombre de la tabla (ajustar según tu estructura)
    protected $table = 'cuotas_financiamiento'; // Cambiar si tu tabla tiene otro nombre
    
    // Campos que se pueden asignar masivamente
    protected $fillable = [
        'linea_financiamiento_id',
        'numero_cuotas',
        'activo',
    ];
    
    // Timestamps
    public $timestamps = false;
    
    /**
     * Relación con la línea de financiamiento
     */
    public function lineaFinanciamiento()
    {
        return $this->belongsTo(LineaFinanciamientoExterna::class, 'linea_financiamiento_id', 'id');
    }
}

