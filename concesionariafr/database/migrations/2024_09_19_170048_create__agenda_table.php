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
        Schema::create('agenda', function (Blueprint $table) {
            $table->id(); // Clave primaria auto-incremental
            
            $table->unsignedBigInteger('idTipoEvento'); // Clave foránea para el tipo de evento
            $table->foreign('idTipoEvento')->references('id')->on('tipo_evento')->onDelete('cascade');

            $table->unsignedBigInteger('idEmpleado'); // Clave foránea para el empleado
            $table->foreign('idEmpleado')->references('id')->on('users')->onDelete('cascade');

            $table->unsignedBigInteger('idCliente'); // Clave foránea para el cliente
            $table->foreign('idCliente')->references('id')->on('users')->onDelete('cascade');

            $table->unsignedBigInteger('idEstado'); // Clave foránea para el estado
            $table->foreign('idEstado')->references('id')->on('estado_evento')->onDelete('cascade');

            $table->string('titulo', 32); // Título del evento
            $table->datetime('fecha'); // Fecha y hora del evento
            $table->string('descripcion', 250); // Descripción del evento
            
            $table->timestamps(); // Crea created_at y updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agenda');
    }
};
