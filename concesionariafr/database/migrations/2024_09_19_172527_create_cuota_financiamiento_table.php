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
        Schema::create('cuota_financiamiento', function (Blueprint $table) {
            $table->id(); // Clave primaria auto-incremental

            $table->unsignedBigInteger('idLineaFinanciamiento'); // Clave foránea para la línea de financiamiento
            $table->foreign('idLineaFinanciamiento')->references('id')->on('linea_financiamiento')->onDelete('cascade');

            $table->integer('numeroCuotas'); // Número de cuotas
            
            $table->timestamps(); // Crea created_at y updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cuota_financiamiento');
    }
};
