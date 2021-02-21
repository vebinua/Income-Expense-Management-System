<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCurrenciesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('currencies', function (Blueprint $table) {
            $table->increments('currency_id');
            $table->string('currency_name', 30);
            $table->string('currency_symbol', 10);
            $table->timestamps();
        });

        $createdAt = DB::raw('CURRENT_TIMESTAMP');

        DB::table('currencies')->insert([
            ['currency_name' => 'Philippine Peso', 'currency_symbol' => 'PHP', 'created_at' => $createdAt],
            ['currency_name' => 'United States Dollar', 'votes' => 'USD', 'created_at' => $createdAt]
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('currencies');
    }
}
