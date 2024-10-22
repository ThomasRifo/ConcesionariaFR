<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EstadoEventoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('estado_evento')->insert([
            ['nombre' => 'Pendiente'],
            ['nombre' => 'Reprogramada'],
            ['nombre' => 'Confirmada'],
            ['nombre' => 'Cancelada'],
            ['nombre' => 'Eliminada'],
        ]);
    }
}

