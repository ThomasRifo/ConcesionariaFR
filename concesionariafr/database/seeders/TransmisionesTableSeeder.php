<?php

namespace Database\Seeders;

use App\Models\Transmision;
use Illuminate\Database\Seeder;

class TransmisionesTableSeeder extends Seeder
{
    public function run()
    {
        $transmisiones = [
            ['tipo' => 'Manual'],
            ['tipo' => 'Automática'],
        ];

        foreach ($transmisiones as $transmision) {
            Transmision::create($transmision);
        }
    }
}

