<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CitaConfirmada extends Mailable
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
        return $this->subject('Confirmación de Cita')
                    ->view('emails.citaConfirmada');  // Asegúrate de que esta vista exista
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Cita Confirmada',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'Mails.citaConfirmada',
        );
    }
}