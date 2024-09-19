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
        Schema::create('notificaciones', function (Blueprint $table) {
            $table->id(); 
            
            $table->unsignedBigInteger('idEmpleado'); 
            $table->foreign('idEmpleado')->references('id')->on('users')->onDelete('cascade');

            $table->string('mensaje', 500);
            $table->timestamp('fecha_envio'); 
            $table->boolean('leido')->default(false); 
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notificaciones');
    }
};
