<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::view('/{path?}','app');

//catch-all route and prevents 404 error when refreshing pages/components
Route::get('{any?}', function ($any = null) {
  return view('app');
})->where('any', '.*');

Route::resource('category', 'App\Http\Controllers\CategoryController');



