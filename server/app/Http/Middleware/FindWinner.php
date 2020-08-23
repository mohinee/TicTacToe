<?php

namespace App\Http\Middleware;

use App\History;
use Closure;
use Illuminate\Support\Facades\Log;

class FindWinner
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, $move)
    {
        $winner = $this->calculateWinner($request);
        if ($winner != null) {
            if ($winner == $move->XO) {
                $winner = $move->played_by;
            } else {
                $winner = $request->player_two;
            }
        }
        $request->merge(['winner' => $winner]);
        $request->merge(['move' => $move]);
        return $request;
    }

    private function calculateWinner($request)
    {
        $allMoves = History::where('game_id', $request->input('game_id'))->get();
        $grid = [[null, null, null], [null, null, null], [null, null, null]];
        foreach ($allMoves as $move) {
            $grid[$move['row']][$move['column']] = $move['XO'];
        }
        for ($i = 0; $i < 3; $i++) {
            if ($grid[$i][0] == $grid[$i][1] && $grid[$i][1] == $grid[$i][2] && $grid[$i][1] != null) {
                return $grid[$i][0];
            } else if ($grid[0][$i] == $grid[1][$i] && $grid[1][$i] == $grid[2][$i] && $grid[2][$i] != null) {
                return $grid[0][$i];
            }
        }
        if ($grid[0][0] == $grid[1][1] && $grid[1][1] == $grid[2][2] && $grid[2][2] != null) {
            return $grid[0][0];
        }
        return null;
    }
}
