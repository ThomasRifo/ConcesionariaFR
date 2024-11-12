<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class LineaFinanciamientoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('linea_financiamiento')->insert([
            [
                'nombre' => 'Prendario 6 meses 6,5m - Mas Conveniente',
                'entidad' => 'Credi Nissan',
                'capitalMax' => 6500000,
                'TNA' => 15.5,
                'CFT' => 18.3,
                'porcentaje' => 10.5,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'nombre' => 'Santander Uva Especial Rolen',
                'entidad' => 'Santander',
                'capitalMax' => 5000000,
                'TNA' => 14.0,
                'CFT' => 16.0,
                'porcentaje' => 9.8,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'nombre' => 'Bancor Uva - Autos hasta 8 Años',
                'entidad' => 'Bancor',
                'capitalMax' => 8000000,
                'TNA' => 13.5,
                'CFT' => 15.2,
                'porcentaje' => 8.7,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'nombre' => 'Bancor Cliente - Tasa Uva',
                'entidad' => 'Bancor',
                'capitalMax' => 7000000,
                'TNA' => 13.5,
                'CFT' => 15.2,
                'porcentaje' => 7.9,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);
    }
}
