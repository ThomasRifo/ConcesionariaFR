<?php
namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class NuevaCita implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $cita;

    public function __construct($cita)
    {
        $this->cita = $cita;
    }

    public function broadcastOn()
    {
        return new Channel('App.Models.User.' . $this->cita->user_id);
    }

    public function broadcastWith()
    {
        return ['data' => $this->cita];
    }
}