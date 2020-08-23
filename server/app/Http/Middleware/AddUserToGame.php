<?php

namespace App\Http\Middleware;

use App\User;
use Closure;

class AddUserToGame
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if ($request->has('player_two') || $request->has('player_one')) {
            $didPlayerStatusUpdate = $this->updateUserStatus($request->has('player_two') ? $request->player_two : $request->player_one, true);
            if ($didPlayerStatusUpdate !== true) {
                return $didPlayerStatusUpdate;
            }
        }

        return $next($request);
    }

    private function updateUserStatus($playerId, $status)
    {
        $user = User::findorFail($playerId);
        if ($user->is_active == $status) {
            return response()->json("Player has one active game set cannot create new game!", 400);
        }
        $user->is_active = $status;
        $user->save();
        return true;
    }
}
