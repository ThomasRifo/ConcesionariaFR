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
        Schema::create('presupuesto', function (Blueprint $table) {
            $table->id(); // Clave primaria auto-incremental

            $table->unsignedBigInteger('idVehiculo'); // Clave foránea para el vehículo
            $table->foreign('idVehiculo')->references('id')->on('vehiculos')->onDelete('cascade');

            $table->unsignedBigInteger('idEmpleado'); // Clave foránea para el empleado
            $table->foreign('idEmpleado')->references('id')->on('users')->onDelete('cascade');

            $table->string('emailCliente', 50); // Email del cliente
            $table->float('montoTotal'); // Monto total del presupuesto
            
            $table->timestamps(); // Crea created_at y updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('presupuesto');
    }
};
