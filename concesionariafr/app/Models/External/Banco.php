<?php

namespace App\Models\External;

use Illuminate\Database\Eloquent\Model;

/**
 * Modelo para acceder a la tabla de bancos en la base de datos externa
 * 
 * Esta clase se conecta a la base de datos externa 'bancos' definida en config/database.php
 */
class Banco extends Model
{
    // Especificar la conexión a la base de datos externa
    protected $connection = 'bancos';
    
    // Nombre de la tabla (ajustar según tu estructura)
    protected $table = 'bancos'; // Cambiar si tu tabla tiene otro nombre
    
    // Campos que se pueden asignar masivamente
    protected $fillable = [
        'nombre',
        'codigo',
        'activo',
        // Agregar más campos según tu estructura
    ];
    
    // Timestamps (ajustar si tu tabla no los tiene)
    public $timestamps = false; // Cambiar a true si tu tabla tiene created_at y updated_at
    
    /**
     * Relación con líneas de financiamiento del banco
     */
    public function lineasFinanciamiento()
    {
        return $this->hasMany(LineaFinanciamientoExterna::class, 'banco_id', 'id');
    }
}

