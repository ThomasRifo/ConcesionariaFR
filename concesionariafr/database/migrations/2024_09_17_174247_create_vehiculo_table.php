<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up()
    {
        Schema::create('vehiculos', function (Blueprint $table) {
            $table->id();
            // Clave foránea de la tabla EstadoVehiculo
            $table->unsignedBigInteger('idEstado');
            $table->foreign('idEstado')->references('id')->on('estado_vehiculos')->onDelete('cascade');
            
            // Clave foránea de la tabla CategoriaVehiculo
            $table->unsignedBigInteger('idCategoria');
            $table->foreign('idCategoria')->references('id')->on('categoria_vehiculos')->onDelete('cascade');
            
            // Otras columnas de la tabla Vehiculo
            $table->string('marca', 100);
            $table->string('modelo', 100);
            $table->integer('anio');
            $table->float('precio', 10, 2);
            $table->string('patente', 7)->unique();
            $table->string('color', 50);
            $table->integer('kilometraje');
            $table->integer('cantidadVistas')->default(0); 
            $table->string('detalles', 300)->nullable(); 

            $table->timestamps(); 
        });
    }

    public function down()
    {
        Schema::dropIfExists('vehiculos');
    }
};