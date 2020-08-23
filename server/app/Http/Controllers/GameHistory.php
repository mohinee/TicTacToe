<?php

namespace App\Http\Controllers;

use App\History;
use App\Http\Middleware\EndGame;
use App\Http\Middleware\FindWinner;
use App\Http\Resources\History as ResourcesHistory;
use App\Listeners\NewMove;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class GameHistory extends Controller
{
    //todo move these to middleware or service providers
    public function create(Request $request)
    {
        try {
            $move = History::create($request->all());
            $findWinner = new FindWinner();
            $request = $findWinner->handle($request, $move);
            $game = new EndGame();
        } catch (\Exception $error) {
            Log::error("Error : " .  $error->getMessage());
        }
        return $game->handle($request);
    }

    public function getAllMoves(Request $request, $game_id)
    {
        try {
            $moves = History::where('game_id', $game_id)->get();
            return response()->json(new ResourcesHistory($moves), 201);
        } catch (\Exception $error) {
            return response()->json($error->getMessage(), 400);
        }
    }
}
