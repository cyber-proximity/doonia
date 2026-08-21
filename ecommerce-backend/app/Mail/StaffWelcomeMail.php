<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class StaffWelcomeMail extends Mailable
{

    public function __construct(
        public readonly User   $user,
        public readonly string $plainPassword,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            to:      $this->user->email,
            subject: 'Your Doonnia Staff Account is Ready',
        );
    }

    public function content(): Content
    {
        return new Content(view: 'emails.staff-welcome');
    }
}
