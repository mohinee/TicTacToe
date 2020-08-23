<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;


class NewMove
{
    use Queueable;
    /** @var move */
    private $move;

    public function __construct($move)
    {
        $this->move = $move;
    }
    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }
    public function toArray($notifiable)
    {
        return ["move" => $this->move];
    }
    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage($this->toArray($notifiable));
    }
    public function broadcastType()
    {
        return 'new-move';
    }
}
