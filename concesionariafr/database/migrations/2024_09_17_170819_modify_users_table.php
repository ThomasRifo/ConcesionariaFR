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
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedBigInteger('idRol')->nullable()->after('id');
            $table->string('lastname');
            $table->string('dni', 12)->nullable()->after('email');
            $table->string('direccion', 100)->nullable()->after('dni');
            $table->string('phone')->nullable()->after('direccion');

            $table->foreign('idRol')->references('id')->on('roles')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            
            $table->dropColumn(['idRol', 'dni', 'direccion', 'phone']);
            $table->dropForeign(['idRol']);
        });
    }
};