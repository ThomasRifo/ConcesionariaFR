<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('imagen_vehiculo', function (Blueprint $table) {
            $table->id(); // Clave primaria auto-incremental
            
            $table->unsignedBigInteger('idVehiculo'); // Clave foránea para el vehículo
            $table->foreign('idVehiculo')->references('id')->on('vehiculos')->onDelete('cascade');

            $table->string('urlImagen', 200); // URL de la imagen
            $table->boolean('imagenPrincipal')->default(false); // Indicador de imagen principal
            
            $table->timestamps(); // Crea created_at y updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('imagen_vehiculo');
    }
};
