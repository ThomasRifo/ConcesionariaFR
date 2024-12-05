<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Notifications\NuevaCita;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Facades\Redirect;

class NotificacionController extends Controller
{
    public function notificacion($id)
{
    $notification = DatabaseNotification::findOrFail($id); // Recuperar la notificación
    $notification->markAsRead();

 
    // Verificar el tipo de notificación y redirigir al show de la agenda
    if ($notification->type === NuevaCita::class) {
        return Redirect::action([AgendaController::class, 'show'], $notification->data['cita']);
    }

    return redirect()->route('home');
}

public function citaAceptada($id)
{
    $notification = DatabaseNotification::findOrFail($id); // Recuperar la notificación
    $notification->markAsRead();

 
    // Verificar el tipo de notificación y redirigir al show de la agenda
    if ($notification->type === NuevaCita::class) {
        return Redirect::action([AgendaController::class, 'showCita'], $notification->data['cita']);
    }

    return redirect()->route('home');
}
    
}