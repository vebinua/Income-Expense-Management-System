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

//Route::get('users', 'App\Http\Controllers\UsersController@index');
Route::post('categories', 'App\Http\Controllers\CategoryController@store');
Route::put('categories/{id}', 'App\Http\Controllers\CategoryController@update');
Route::get('categories/{id}', 'App\Http\Controllers\CategoryController@show');
Route::get('categories', 'App\Http\Controllers\CategoryController@index');
Route::delete('categories/{id}', 'App\Http\Controllers\CategoryController@destroy');