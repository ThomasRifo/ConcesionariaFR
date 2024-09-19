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
        Schema::create('autos_cliente', function (Blueprint $table) {
            $table->id(); // Clave primaria auto-incremental

            $table->unsignedBigInteger('idCliente'); // Clave foránea para el cliente
            $table->foreign('idCliente')->references('id')->on('users')->onDelete('cascade');

            $table->unsignedBigInteger('idVehiculo'); // Clave foránea para el vehículo
            $table->foreign('idVehiculo')->references('id')->on('vehiculos')->onDelete('cascade');

            $table->timestamps(); // Crea created_at y updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('autos_cliente');
    }
};
