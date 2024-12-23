<?php

use App\Http\Controllers\AgendaController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\AutosClienteController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EmpleadoController;
use App\Http\Controllers\NotificacionController;
use App\Http\Controllers\VehiculoController;
use App\Http\Controllers\ClienteController;
use App\Models\AutosCliente;
use App\Models\Vehiculo;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

// Ruta raíz (inicio)
Route::get('/', function () {
    $vehiculos = Vehiculo::with('imagenes')->get(); // Obtén todos los vehículos de la base de datos

    return Inertia::render('Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'vehiculos' => $vehiculos, // Pasa los vehículos a la vista
    ]);
})->name('home');

// Ruta dashboard
Route::get('/dashboard', function () {
    if (auth()->user()->hasRole('admin') || auth()->user()->hasRole('empleado')) {
        return Inertia::render('Dashboard');
    }
    return Inertia::render('register') ;
})->middleware(['role:empleado|admin'])->name('dashboard');

// Rutas protegidas para perfiles
Route::group(['middleware' => ['role:empleado|admin|cliente']], function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Rutas para vehículos
Route::get('/vehiculos', [VehiculoController::class, 'index'])->name('vehiculos.index');
Route::get('/vehiculos/{marca}-{modelo}-{anio}', [VehiculoController::class, 'show'])->name('vehiculo.show');

Route::group(['middleware' => ['role:admin|empleado']], function () {

    Route::post('/vehiculos/registrar-vehiculo', [VehiculoController::class, 'store'])->name('vehiculos.store');
    Route::get('/vehiculos/create', [VehiculoController::class, 'create'])->name('vehiculos.create');
    Route::get('/vehiculos/edit', [VehiculoController::class, 'edit'])->name('vehiculos.edit');
    Route::put('/vehiculos/{id}', [VehiculoController::class, 'update'])->name('vehiculos.update');
    Route::delete('/vehiculos/{id}', [VehiculoController::class, 'destroy'])->name('vehiculos.destroy');

});


Route::post('/favoritos/add', [AutosClienteController::class, 'store'])->name('favoritos.add');
Route::delete('/favoritos/remove', [AutosClienteController::class, 'destroy'])->name('favoritos.remove');
Route::get('/favoritos/list', [AutosClienteController::class, 'favoritos'])->name('favoritos.list');


Route::group(['middleware' => ['role:admin|empleado']], function () {

    Route::get('/agenda', [AgendaController::class, 'index'])->name('agenda.index');
    Route::get('/agenda/create', [AgendaController::class, 'create'])->name('agenda.create');
    Route::post('/agenda/store', [AgendaController::class, 'store'])->name('agenda.store');
    


    Route::put('/agenda/update/{id}', [AgendaController::class, 'update'])->name('agenda.update');
    Route::get('/agenda/buscar-clientes', [AgendaController::class, 'buscarClientes']);
    Route::put('/agenda/delete/{id}', [AgendaController::class, 'delete'])->name('agenda.delete');
    Route::put('/agenda/aceptar/{id}', [AgendaController::class, 'accept'])->name('agenda.accept');
    Route::get('/agenda/show/{id}', [AgendaController::class, 'show'])->name('agenda.show');

});

Route::get('/showCita/{id}', [AgendaController::class, 'showCita'])->name('agenda.show');

Route::post('/agenda/storeCita', [AgendaController::class, 'storeCita'])->name('agenda.storeCita')->middleware('role:cliente|admin');;

Route::group(['middleware' => ['role:admin']], function () {
    Route::get('/empleados', [EmpleadoController::class, 'index'])->name('empleados.index');
    Route::get('/Empleados/registrar-empleados', [EmpleadoController::class, 'create'])->name('registeredEmployed');
    Route::post('/Empleados/registrar-empleados', [EmpleadoController::class, 'store']);
    Route::put('/empleados/{id}', [EmpleadoController::class, 'update'])->name('empleados.update');
    Route::delete('/empleados/{id}', [EmpleadoController::class, 'destroy'])->name('empleados.destroy');
});

Route::group(['middleware' => ['role:admin|empleado']], function () {
    Route::get('/clientes', [ClienteController::class, 'index'])->name('clientes.index');
    Route::put('/clientes/{id}', [ClienteController::class, 'update'])->name('clientes.update');
    Route::delete('/clientes/{id}', [ClienteController::class, 'destroy'])->name('clientes.destroy');
});

Route::get('/buscar-clientes', [RegisteredUserController::class, 'buscarClientes']);

Route::put('/notificacion/{id}', [NotificacionController::class, 'notificacion'])->name('notificacion');
Route::put('/citaAceptada/{id}', [NotificacionController::class, 'citaAceptada'])->name('citaAceptada');
Route::put('/citaReprogramada/{id}', [NotificacionController::class, 'citaReprogramada'])->name('citaReprogramada');

require __DIR__.'/auth.php';