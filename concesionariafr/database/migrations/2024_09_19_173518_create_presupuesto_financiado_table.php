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
        Schema::create('presupuesto_financiado', function (Blueprint $table) {
            $table->id(); // Clave primaria auto-incremental

            $table->unsignedBigInteger('idFinanciamiento'); // Clave foránea para financiamiento
            $table->foreign('idFinanciamiento')->references('id')->on('financiamiento')->onDelete('cascade');

            $table->unsignedBigInteger('idPresupuesto'); // Clave foránea para presupuesto
            $table->foreign('idPresupuesto')->references('id')->on('presupuesto')->onDelete('cascade');

            $table->timestamps(); // Crea created_at y updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('presupuesto_financiado');
    }
};
