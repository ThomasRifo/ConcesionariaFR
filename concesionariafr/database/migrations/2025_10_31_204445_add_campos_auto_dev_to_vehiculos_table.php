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
        Schema::table('vehiculos', function (Blueprint $table) {
            $table->string('pais_origen', 50)->nullable()->after('vin');
            $table->string('tipo_motor', 50)->nullable()->after('pais_origen');
            $table->string('cilindrada', 20)->nullable()->after('tipo_motor');
            $table->string('potencia', 20)->nullable()->after('cilindrada');
            $table->integer('num_puertas')->nullable()->after('potencia');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vehiculos', function (Blueprint $table) {
            $table->dropColumn(['pais_origen', 'tipo_motor', 'cilindrada', 'potencia', 'num_puertas']);
        });
    }
};
