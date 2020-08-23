<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class History extends Model
{
    use Notifiable;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'game_id', 'move_number', 'played_by', 'XO', 'row', 'column', 'time_left',
    ];


    public function receivesBroadcastNotificationsOn()
    {
        return 'Game.' . $this->game_id;
    }
}
