<?php

namespace App\Http\Middleware;

use App\Game;
use App\Http\Controllers\User as ControllersUser;
use App\Http\Resources\Game as ResourcesGame;
use App\Events\NewMove;
use App\History;
use App\Http\Resources\History as ResourcesHistory;
use App\User;
use Closure;
use Illuminate\Support\Facades\Log;

class EndGame
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next = null)
    {
        try {
            $id = json_decode(Game::where('game_id', $request->game_id)->first('id'), true);
            $game = Game::findorFail($id['id']);
            if (!is_null($request->winner)) {
                $game->status = 'EXPIRED';
                $game->result = $request->winner;
                $player_one = $game->player_one;
                $player_two = $game->player_two;
                $game->next_move_by = null;
                $game->save();
                $this->updateUsers($player_one, $player_one == $request->winner ? 1 : 0);
                $this->updateUsers($player_two, $player_two == $request->winner ? 1 : 0);
            } else {
                if ($request->played_by == $game->player_one) {
                    $game->next_move_by = $game->player_two;
                } else {
                    $game->next_move_by = $game->player_one;
                }
                $game->save();
            }
            $moves = History::where('game_id', $game->game_id)->get();
            $res['game'] = new ResourcesGame($game);
            $res['moves'] = new ResourcesHistory($moves);
            event(new NewMove($res, "game-" . $game->game_id));
            return (new ResourcesGame($game))->response()->setStatusCode(201);
        } catch (\Exception $error) {
            return response()->json($error->getMessage(), 400);
        }
    }


    private function updateUsers($userId, $score)
    {
        $user = User::findorFail($userId);
        $user->is_active = false;
        $user->score = $user->score + $score;
        $user->save();
    }
}
