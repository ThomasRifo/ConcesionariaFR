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
        Schema::create('linea_financiamiento', function (Blueprint $table) {
            $table->id(); // Clave primaria auto-incremental
            
            $table->string('nombre', 100); // Nombre de la línea de financiamiento
            $table->string('entidad', 50); // Entidad que ofrece el financiamiento
            $table->float('capitalMax'); // Capital máximo que se puede financiar
            $table->float('TNA'); // Tasa Nominal Anual
            $table->float('CFT'); // Costo Financiero Total
            
            $table->timestamps(); // Crea created_at y updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('linea_financiamiento');
    }
};
