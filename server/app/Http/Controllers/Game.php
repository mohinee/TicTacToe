<?php

namespace App\Http\Controllers;

use App\Game as AppGame;
use App\History;
use App\Http\Resources\Game as ResourcesGame;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Middleware\AddUserToGame;
use App\Http\Resources\History as ResourcesHistory;

class Game extends Controller
{
    public function create(Request $request)
    {
        try {
            Log::info("request : " . json_encode($request->all()));
            $game_id = uniqid();
            $request->merge(['game_id' => $game_id]);
            $game = AppGame::create($request->all());
            Log::info("created game : " . json_encode(new ResourcesGame($game)));
            return response()->json(new ResourcesGame($game), 201);
        } catch (\Exception $error) {
            return response()->json($error->getMessage(), 400);
        }
    }

    public function update(Request $request, $game_id)
    {
        try {
            $id = json_decode(AppGame::where('game_id', $game_id)->first('id'), true);
            $game = AppGame::findorFail($id['id']);
            $game->player_two = $request->player_two;
            $game->first_move_by = $request->first_move_by;
            $game->next_move_by = $request->first_move_by;
            $game->status = 'ACTIVE';
            $game->save();
            return (new ResourcesGame($game))->response()->setStatusCode(201);
        } catch (\Exception $error) {
            return response()->json($error->getMessage(), 400);
        }
    }

    public function get(Request $request, $id)
    {
        try {
            $game = AppGame::where('game_id', $id)->get()[0];
            $moves = History::where('game_id', $id)->get();
            $res['game'] = new ResourcesGame($game);
            $res['moves'] = new ResourcesHistory($moves);
            return response()->json($res, 201);
        } catch (\Exception $error) {
            return response()->json($error->getMessage(), 400);
        }
    }

    public function getAllCreatedGames(Request $request)
    {
        try {
            $game = AppGame::where('status', 'CREATED')->get();
            return (new ResourcesGame($game))->response()->setStatusCode(201);
        } catch (\Exception $error) {
            return response()->json($error->getMessage(), 400);
        }
    }
}
