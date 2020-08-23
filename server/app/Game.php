<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Game extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'game_id', 'player_one', 'player_two', 'timer', 'first_move_by', 'next_move_by', 'result', 'status',
    ];
}
