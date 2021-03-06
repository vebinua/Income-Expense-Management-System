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
	Route::get('categories/withsub/{id}/{type}', 'App\Http\Controllers\CategoryController@showWithSub');
  Route::get('categories/{id}', 'App\Http\Controllers\CategoryController@show');
  Route::get('categories/type/{type}/user/{id}', 'App\Http\Controllers\CategoryController@getUserCategoriesByType');
  Route::get('categories/{id}/user/{userId}', 'App\Http\Controllers\CategoryController@getUserCategory');
  Route::post('categories', 'App\Http\Controllers\CategoryController@store');
  Route::put('categories/{id}', 'App\Http\Controllers\CategoryController@update');
  Route::delete('categories/{id}', 'App\Http\Controllers\CategoryController@destroy');

  Route::post('subcategories', 'App\Http\Controllers\SubcategoryController@store');

  Route::get('currencies', 'App\Http\Controllers\CurrencyController@index');
  Route::get('wallets/{id}/{walletId}', 'App\Http\Controllers\WalletController@showByUserWithWalletId');
  Route::get('wallets/{id}', 'App\Http\Controllers\WalletController@showByUser');
  Route::post('wallets', 'App\Http\Controllers\WalletController@store');
  Route::put('wallets/{id}', 'App\Http\Controllers\WalletController@update');
  Route::delete('wallets/{id}', 'App\Http\Controllers\WalletController@destroy');
  Route::get('wallets/{id}/current-balance/all', 'App\Http\Controllers\WalletController@showAllCurrentBalance');

  Route::post('transactions', 'App\Http\Controllers\TransactionController@store');
  Route::get('transactions/flows/last-month/{id}', 'App\Http\Controllers\TransactionController@getFlowsLastMonth');  
  Route::get('transactions/flows/{id}/{month}/{year}', 'App\Http\Controllers\TransactionController@showFlowsByMonthYear');  
  Route::get('transactions/last-month/{id}', 'App\Http\Controllers\TransactionController@getUserTransactionsLastMonth');    
  Route::get('transactions/{id}/{month}/{year}', 'App\Http\Controllers\TransactionController@getUserTransactionsByMonthYear');  
  Route::get('transactions/{id}', 'App\Http\Controllers\TransactionController@showByUser');    
});

//Route::get('categories/{id}', 'App\Http\Controllers\CategoryController@show');
//Route::get('categories', 'App\Http\Controllers\CategoryController@index');


//Route::get('categories', 'App\Http\Controllers\CategoryController@index');


Route::post('users', 'App\Http\Controllers\UserController@store');
Route::post('users/login', 'App\Http\Controllers\UserController@login');
