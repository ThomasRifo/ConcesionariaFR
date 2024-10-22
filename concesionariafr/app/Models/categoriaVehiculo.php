<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class categoriaVehiculo extends Model
{
    use HasFactory;

    protected $table = 'categoria_vehiculos';

    public $timestamps = false;

    protected $fillable = ['tipo'];
}