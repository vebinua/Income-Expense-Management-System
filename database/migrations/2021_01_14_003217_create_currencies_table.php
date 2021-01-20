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

        DB::table('currencies')->insert([
            ['currency_name' => 'Philippine Peso', 'currency_symbol' => 'PHP'],
            ['currency_name' => 'United States Dollar', 'votes' => 'USD']
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
