<?php

namespace Database\Seeders;

use App\Models\Combustible;
use Illuminate\Database\Seeder;

class CombustiblesTableSeeder extends Seeder
{
    public function run()
    {
        $combustibles = [
            ['tipo' => 'Nafta'],
            ['tipo' => 'Diésel'],
            ['tipo' => 'Eléctrico'],
        ];

        foreach ($combustibles as $combustible) {
            Combustible::create($combustible);
        }
    }
}

