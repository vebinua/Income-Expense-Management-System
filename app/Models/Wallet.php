<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wallet extends Model
{
    use HasFactory;

    protected $primaryKey = 'wallet_id';

    protected $fillable = [
      'wallet_id',
      'wallet_name',
      'initial_balance',
      'current_balance',
      'currency_id',
      'user_id'       
    ];
}
