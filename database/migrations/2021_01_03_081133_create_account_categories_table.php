<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAccountCategoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->increments('category_id');
            $table->string('category', 50);
            $table->enum('account_type',['asset','liability'])->default('asset');
            $table->integer('user_id')->unsigned();
            $table->integer('parent_id')->unsigned()->default(0);
            $table->timestamps();
            $table->foreign('user_id')->references('user_id')->on('users');
        });

        $createdAt = DB::raw('CURRENT_TIMESTAMP');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('categories');
    }
}
