<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Crear un usuario Admin
        $admin = User::create([
            'name' => 'Admin',
            'lastname' => 'Example',
            'email' => 'admin@example.com',
            'password' => Hash::make('12345678'),
            'activo' => true,
        ]);
        $admin->assignRole('admin');

        // Crear un usuario Empleado
        $empleado = User::create([
            'name' => 'Empleado',
            'lastname' => 'Example',
            'email' => 'empleado@example.com',
            'password' => Hash::make('12345678'),
            'activo' => true,
        ]);
        $empleado->assignRole('empleado'); 

        // Crear un usuario Cliente
        $cliente = User::create([
            'name' => 'Cliente',
            'lastname' => 'Example',
            'email' => 'cliente@example.com',
            'password' => Hash::make('12345678'),
            'activo' => true,
        ]);
        $cliente->assignRole('cliente'); 
    }
}