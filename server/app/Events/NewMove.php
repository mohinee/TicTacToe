<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class NewMove implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;
    public $channelName;


    public function __construct($message, $channelName)
    {
        $this->message = $message;
        $this->channelName = $channelName;
    }

    public function broadcastOn()
    {
        Log::info("braodcast details. " . json_encode($this));
        return [$this->channelName];
    }

    public function broadcastAs()
    {
        return 'new-move-made';
    }
}
