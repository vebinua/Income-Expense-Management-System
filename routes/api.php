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

Route::post('categories', 'App\Http\Controllers\CategoryController@store');
Route::put('categories/{id}', 'App\Http\Controllers\CategoryController@update');
Route::get('categories/{id}', 'App\Http\Controllers\CategoryController@show');

Route::group([
    'middleware' => 'jwt.auth',
    'prefix' => 'auth'

], function ($router) {


});

Route::get('categories', 'App\Http\Controllers\CategoryController@index');

Route::delete('categories/{id}', 'App\Http\Controllers\CategoryController@destroy');

Route::post('users', 'App\Http\Controllers\UserController@store');
Route::post('users/login', 'App\Http\Controllers\UserController@login');
