<?php

namespace App\Http\Controllers;

use App\Http\Resources\User as ResourcesUser;
use App\User as AppUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class User extends Controller
{
    public function create(Request $request)
    {
        try {
            Log::info("recieved request: " . json_encode($request->all()));
            $user = AppUser::where('email', $request->email)->first();
            if (is_null($user)) {
                $user = AppUser::create($request->all());
            }

            return (new ResourcesUser($user))->response()->setStatusCode(201);
        } catch (\Exception $error) {
            return response()->json($error->getMessage(), 400);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $user = AppUser::findorFail($id);
            $user->score = $user->score + 1;
            $user->save();
            return (new ResourcesUser($user))->response()->setStatusCode(201);
        } catch (\Exception $error) {
            return response()->json($error->getMessage(), 400);
        }
    }

    public function get(Request $request, $id)
    {
        try {
            $user = AppUser::findorFail($id);
            return (new ResourcesUser($user))->response()->setStatusCode(201);
        } catch (\Exception $error) {
            return response()->json($error->getMessage(), 400);
        }
    }
}
