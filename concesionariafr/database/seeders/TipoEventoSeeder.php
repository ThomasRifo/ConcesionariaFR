<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TipoEventoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('tipo_evento')->insert([
            ['nombre' => 'Tarea'],
            ['nombre' => 'Cita'],
        ]);
    }
}

