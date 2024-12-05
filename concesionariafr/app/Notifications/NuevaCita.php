<?php

namespace App\Notifications;

use App\Models\Agenda;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\DatabaseMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;


class NuevaCita extends Notification
{
    use Queueable;

    private $data;


    public function __construct(
        private readonly Agenda $agenda,
        private readonly User $user, 
        private readonly array $canales,)
    {

    }

    public function via(object $notifiable): array
    {
        return $this->canales;
    }


    public function toArray( object $notifiable): array
    {
        return [
            'cita' => $this->agenda->id,
            'titulo' => $this->agenda->titulo,
            'fecha' => $this->agenda->fecha,
            'idEstado' =>$this->agenda->idEstado,
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'data' => [
                'titulo' => $this->agenda->titulo,
                'descripcion' => $this->agenda->descripcion,
                'fecha' => $this->agenda->fecha,
                'idEstado' =>$this->agenda->idEstado,
            ],
        ]);
    }
}
