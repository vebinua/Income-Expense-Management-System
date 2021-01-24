<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


/*Route::group([
		'middleware' => 'jwt.auth'

], function ($router) {

	Route::get('categories/{id}', 'App\Http\Controllers\CategoryController@show');

});*/
Route::group(['middleware' => ['jwt.verify']], function() {
	Route::get('categories/{id}', 'App\Http\Controllers\CategoryController@showByUser');
  Route::get('categories/{id}/edit', 'App\Http\Controllers\CategoryController@show');
  Route::post('categories', 'App\Http\Controllers\CategoryController@store');
  Route::put('categories/{id}', 'App\Http\Controllers\CategoryController@update');
  Route::delete('categories/{id}', 'App\Http\Controllers\CategoryController@destroy');

  Route::get('currencies', 'App\Http\Controllers\CurrencyController@index');
  Route::get('wallets/{id}', 'App\Http\Controllers\WalletController@showByUser');
  Route::post('wallets', 'App\Http\Controllers\WalletController@store');
  Route::delete('wallets/{id}', 'App\Http\Controllers\WalletController@destroy');

  Route::post('transactions', 'App\Http\Controllers\TransactionController@store');
  Route::get('transactions/{id}', 'App\Http\Controllers\TransactionController@showByUser');  
  Route::get('transactions/{id}/{month}/{year}', 'App\Http\Controllers\TransactionController@showFlowsByMonthYear');  
});

//Route::get('categories/{id}', 'App\Http\Controllers\CategoryController@show');
//Route::get('categories', 'App\Http\Controllers\CategoryController@index');


//Route::get('categories', 'App\Http\Controllers\CategoryController@index');


Route::post('users', 'App\Http\Controllers\UserController@store');
Route::post('users/login', 'App\Http\Controllers\UserController@login');
