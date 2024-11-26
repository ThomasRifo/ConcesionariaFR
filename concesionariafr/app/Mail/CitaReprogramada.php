<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CitaReprogramada extends Mailable
{
    public $nombreCliente;
    public $fecha;
    public $descripcion;
    public $nombreEmpleado;

    public function __construct($data)
    {
        $this->nombreCliente = $data['nombreCliente'];
        $this->fecha = $data['fecha'];
        $this->descripcion = $data['descripcion'];
        $this->nombreEmpleado = $data['nombreEmpleado'];
    }

    public function build()
    {
        return $this->subject('Reprogramación de cita')
                    ->view('emails.citaReprogramada');  // Asegúrate de que esta vista exista
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Cita Reprogramada',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'Mails.citaReprogramada',
        );
    }
}