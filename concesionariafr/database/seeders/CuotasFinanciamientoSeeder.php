<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CuotasFinanciamientoSeeder extends Seeder
{
    public function run()
    {
        // Cuotas para la línea 1
        DB::table('cuota_financiamiento')->insert([
            ['idLineaFinanciamiento' => 1, 'numeroCuotas' => 6],
        ]);

        // Cuotas para la línea 2
        $cuotasLinea2 = [12, 18, 24, 36, 48];
        foreach ($cuotasLinea2 as $cuota) {
            DB::table('cuota_financiamiento')->insert([
                'idLineaFinanciamiento' => 2,
                'numeroCuotas' => $cuota,
            ]);
        }

        // Cuotas para la línea 3
        $cuotasLinea3y4 = [12, 24, 36, 48, 60];
        foreach ($cuotasLinea3y4 as $cuota) {
            DB::table('cuota_financiamiento')->insert([
                'idLineaFinanciamiento' => 3,
                'numeroCuotas' => $cuota,
            ]);
            DB::table('cuota_financiamiento')->insert([
                'idLineaFinanciamiento' => 4,
                'numeroCuotas' => $cuota,
            ]);
        }
    }
}
