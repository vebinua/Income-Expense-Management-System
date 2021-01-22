<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $primaryKey = 'transaction_id';

    protected $fillable = [
      'wallet_id',
      'transaction_type',
      'amount',
      'transaction_date',
      'note',
      'transaction_status',
      'category_id',
      'subcategory_id',
      'currency_id',
      'user_id'       
    ];
}
