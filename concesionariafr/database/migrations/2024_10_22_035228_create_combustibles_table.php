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
    Schema::create('combustibles', function (Blueprint $table) {
        $table->id();
        $table->string('tipo');
        $table->timestamps();
    });
}

public function down()
{
    Schema::dropIfExists('combustibles');
}

};
