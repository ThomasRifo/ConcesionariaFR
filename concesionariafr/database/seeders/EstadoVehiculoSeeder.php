<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EstadoVehiculoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('estado_vehiculos')->insert([
            ['estado' => 'disponible'],
            ['estado' => 'vendido'],
        ]);
    }
}

