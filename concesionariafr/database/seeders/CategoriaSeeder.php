<?php
// database/seeders/CategoriaSeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\categoriaVehiculo;

class CategoriaSeeder extends Seeder
{
    public function run()
    {
        
        categoriaVehiculo::create(['tipo' => 'SUV']);
        categoriaVehiculo::create(['tipo' => 'Sedán']);
        categoriaVehiculo::create(['tipo' => 'Pickup']);
        categoriaVehiculo::create(['tipo' => 'Deportivo']);
        categoriaVehiculo::create(['tipo' => 'Hatchback']);
        
    }
}


