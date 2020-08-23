<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGamesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->string('game_id');
            $table->integer('player_one');
            $table->integer('player_two')->nullable();
            $table->integer('timer');
            $table->integer('first_move_by')->nullable();
            $table->integer('next_move_by')->nullable();
            $table->integer('result')->nullable();
            $table->enum('status', ['CREATED', 'ACTIVE', 'EXPIRED'])->default('CREATED');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('games');
    }
}
