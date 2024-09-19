<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RegistrarEmpleadoController;
use App\Http\Controllers\VehiculoController;
use App\Models\estadoVehiculo;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

// Ruta raíz (inicio)
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Ruta dashboard
Route::get('/dashboard', function () {
    if (auth()->user()->hasRole('admin') || auth()->user()->hasRole('cliente')) {
        return Inertia::render('Dashboard');
    }
    return Inertia::render('register') ;
})->middleware(['auth', 'verified'])->name('dashboard');

// Rutas protegidas para perfiles
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Rutas para vehículos
Route::get('/vehiculos', [VehiculoController::class, 'index'])->name('vehiculos.index');


Route::group(['middleware' => ['role:admin']], function () {
    Route::get('/registrarEmpleados', [RegistrarEmpleadoController::class, 'create'])->name('registeredEmployed');
    Route::post('/registrarEmpleados', [RegistrarEmpleadoController::class, 'store']);
});

require __DIR__.'/auth.php';