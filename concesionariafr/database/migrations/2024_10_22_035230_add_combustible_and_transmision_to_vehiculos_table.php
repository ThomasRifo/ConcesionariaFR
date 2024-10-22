<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::table('vehiculos', function (Blueprint $table) {
        $table->unsignedBigInteger('idCombustible')->nullable();
        $table->unsignedBigInteger('idTransmision')->nullable();

        $table->foreign('idCombustible')->references('id')->on('combustibles');
        $table->foreign('idTransmision')->references('id')->on('transmisiones');
    });
}

public function down()
{
    Schema::table('vehiculos', function (Blueprint $table) {
        $table->dropForeign(['idCombustible']);
        $table->dropForeign(['idTransmision']);
        $table->dropColumn(['idCombustible', 'idTransmision']);
    });
}

};
