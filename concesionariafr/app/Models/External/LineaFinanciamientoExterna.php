<?php

namespace App\Models\External;

use Illuminate\Database\Eloquent\Model;

/**
 * Modelo para acceder a las líneas de financiamiento en la base de datos externa
 */
class LineaFinanciamientoExterna extends Model
{
    // Especificar la conexión a la base de datos externa
    protected $connection = 'bancos';
    
    // Nombre de la tabla (ajustar según tu estructura)
    protected $table = 'lineas_financiamiento'; // Cambiar si tu tabla tiene otro nombre
    
    // Campos que se pueden asignar masivamente
    protected $fillable = [
        'banco_id',
        'nombre',
        'tasa_interes',
        'cft',
        'capital_max',
        'activo',
        // Agregar más campos según tu estructura
    ];
    
    // Timestamps
    public $timestamps = false;
    
    /**
     * Relación con el banco
     */
    public function banco()
    {
        return $this->belongsTo(Banco::class, 'banco_id', 'id');
    }
    
    /**
     * Relación con las cuotas disponibles
     */
    public function cuotas()
    {
        return $this->hasMany(CuotaFinanciamientoExterna::class, 'linea_financiamiento_id', 'id');
    }
}

