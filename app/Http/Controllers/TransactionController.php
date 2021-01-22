<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Category;
use Illuminate\Http\Request;
use Carbon\Carbon;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {  

        $userId = $request->data['user_id'];
        $categoryId = $request->data['category_id'];

        $timestamp = Carbon::parse($request->data['transaction_date']);
        $date = Carbon::createFromFormat('Y-m-d H:i:s', $timestamp, 'PST');
        $date->setTimezone('UTC');

        $transactionStatus = 'completed'; //[pending, completed]
        $transactionDate = $date;
        $creditAmount = 0;
        $debitAmount = 0;
        
        /*to determine transaction type, retrieve the category's account type based on category id. Here's a map:
        / asset - income
        / liability - expense
        / others: [income, expense, adjustment, transfer]
        */
        $matches = [
            'category_id' => $categoryId,
            'user_id' => $userId
        ];

        $category = Category::where($matches)->first();
        
        if ($category->account_type == 'asset') {
            $transactionType = 'income';
        } else if ($category->account_type == 'liability') {
            $transactionType = 'expense';
        }

        Transaction::create([
            'wallet_id' => $request->data['wallet_id'],
            'transaction_type' => $transactionType,
            'amount' => $request->data['amount'],
            'transaction_date' => $transactionDate,
            'note' => $request->data['note'],
            'transaction_status' => $transactionStatus,
            'category_id' => $categoryId,
            'subcategory_id' => 0,
            'currency_id' => $request->data['currency_id'],
            'user_id' => $userId
        ]);
        
        return response()->json('  Added Successfully! ' . print_r($request->data));
    }   

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
