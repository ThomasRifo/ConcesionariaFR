<?php

namespace Database\Seeders;

use App\Models\TipoEvento;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(UserSeeder::class);
        $this->call(CategoriaSeeder::class);
        $this->call(CombustiblesTableSeeder::class);
        $this->call(EstadoVehiculoSeeder::class);
        $this->call(TransmisionesTableSeeder::class);
        $this->call(TipoEventoSeeder::class);
        $this->call(EstadoEventoSeeder::class);
        $this->call(LineaFinanciamientoSeeder::class);
    }
}
