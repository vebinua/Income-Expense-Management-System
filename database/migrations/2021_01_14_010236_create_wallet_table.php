<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWalletTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('wallets', function (Blueprint $table) {
			$table->increments('wallet_id');
			$table->string('wallet_name', 50);
			$table->integer('initial_balance');
			$table->integer('current_balance');
			$table->integer('currency_id')->unsigned();
			$table->integer('user_id')->unsigned();
			$table->timestamps();

			$table->foreign('currency_id')->references('currency_id')->on('currencies');
			$table->foreign('user_id')->references('user_id')->on('users');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists('wallets');
	}
}
