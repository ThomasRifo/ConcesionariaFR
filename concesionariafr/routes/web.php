<?php

use App\Http\Controllers\AgendaController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EmpleadoController;
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
    if (auth()->user()->hasRole('admin') || auth()->user()->hasRole('empleado') || auth()->user()->hasRole('cliente')) {
        return Inertia::render('Dashboard');
    }
    return Inertia::render('register') ;
})->middleware(['auth', 'verified'])->name('dashboard');

// Rutas protegidas para perfiles
Route::group(['middleware' => ['role:empleado|admin|cliente']], function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Rutas para vehículos
Route::get('/Vehiculos', [VehiculoController::class, 'index'])->name('vehiculos.index');

Route::group(['middleware' => ['role:admin|empleado']], function () {

    Route::post('/Vehiculos/registrar-vehiculo', [VehiculoController::class, 'store'])->name('vehiculos.store');
    Route::get('/Vehiculos/create', [VehiculoController::class, 'create'])->name('vehiculos.create');

});


Route::group(['middleware' => ['role:admin|empleado']], function () {

    Route::get('/agenda', [AgendaController::class, 'index'])->name('agenda.index');
    Route::get('/agenda/create', [AgendaController::class, 'create'])->name('agenda.create');
    Route::post('/agenda/store', [AgendaController::class, 'store'])->name('agenda.store');


    Route::put('/agenda/update/{id}', [AgendaController::class, 'update'])->name('agenda.update');
    Route::delete('/agenda/delete/{id}', [AgendaController::class, 'delete'])->name('agenda.delete');
    Route::get('/agenda/buscar-clientes', [AgendaController::class, 'buscarClientes']);

});

Route::post('/agenda/storeCita', [AgendaController::class, 'storeCita'])->name('agenda.storeCita')->middleware('role:cliente');;

Route::group(['middleware' => ['role:admin']], function () {
    Route::get('/Empleados', [EmpleadoController::class, 'index'])->name('empleados.index');
    Route::get('/Empleados/registrar-empleados', [EmpleadoController::class, 'create'])->name('registeredEmployed');
    Route::post('/Empleados/registrar-empleados', [EmpleadoController::class, 'store']);
    Route::get('/Empleados/empleados', [EmpleadoController::class, 'edit'])->name('empleados.edit');
    Route::patch('/Empleados/empleados', [EmpleadoController::class, 'update'])->name('empleados.update');
});

Route::get('/buscar-clientes', [RegisteredUserController::class, 'buscarClientes']);

require __DIR__.'/auth.php';