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
    Schema::table('linea_financiamiento', function (Blueprint $table) {
        $table->decimal('porcentaje', 5, 2)->after('CFT')->nullable();
    });
}

public function down()
{
    Schema::table('linea_financiamiento', function (Blueprint $table) {
        $table->dropColumn('porcentaje');
    });
}

};
