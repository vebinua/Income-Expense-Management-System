<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTransactionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->increments('transaction_id');
            $table->integer('wallet_id')->unsigned();
            $table->enum('transaction_type',['income','expense', 'adjustment', 'transfer'])->default('income');
            $table->float('credit_amount', 10, 2);
            $table->float('debit_amount', 10, 2);
            $table->timestamp('transaction_date');
            $table->text('note');
            $table->enum('transaction_status',['pending','completed'])->default('completed');
            $table->integer('category_id')->unsigned();
            $table->integer('subcategory_id')->unsigned();
            $table->integer('currency_id')->unsigned();
            $table->integer('user_id')->unsigned();
            $table->timestamps();

            $table->foreign('wallet_id')->references('wallet_id')->on('wallets');
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
        Schema::dropIfExists('transactions');
    }
}
