<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wallet extends Model
{
    use HasFactory;

    protected $primaryKey = 'category_id';

    protected $fillable = [
      'wallet_id',
      'wallet_name',
      'initial_balance',
      'currency_id',
      'user_id'       
    ];
}
