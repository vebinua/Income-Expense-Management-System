<?php

namespace App\Http\Controllers;

use App\Models\Wallet;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Carbon\Carbon;

header('Access-Control-Allow-Methods : POST, GET, OPTIONS, PUT, DELETE, HEAD');
header('Allow: POST, GET, OPTIONS, PUT, DELETE, HEAD');
header('Access-Control-Allow-Headers : X-Requested-With, Content-Type');

class WalletController extends Controller
{
	/**
	 * Display a listing of the resource.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index()
	{
	

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

	public function showAllCurrentBalance($id) {

	 	try {

	  	$wallets = Wallet::selectRaw('sum(current_balance) as sum')->where('user_id', $id)->get();
		
	  	return $wallets;
		
		} catch(ModelNotFoundException $e) {
			return response()->json(['status' => 'fail', 'message' => $e]);   
		}	  
	}

	public function showByUserWithWalletId($id, $walletId) {
		try {

	  	$wallets = Wallet::where('user_id', $id)->where('wallet_id', $walletId)->get();

	  	return $wallets;
		
		} catch(ModelNotFoundException $e) {
			return response()->json(['status' => 'fail', 'message' => $e]);   
		}	  	
	}

	public function showByUser($id)
	{ 

		try {

	  	$wallets = Wallet::where('user_id', $id)->get();

	  	return $wallets;
		
		} catch(ModelNotFoundException $e) {
			return response()->json(['status' => 'fail', 'message' => $e]);   
		}	  
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function store(Request $request)
	{
		$wallet = Wallet::create([
			'wallet_name' => $request->data['wallet_name'],
			'initial_balance' => $request->data['initial_balance'] * 100,
			'current_balance' => $request->data['initial_balance'] * 100,
			'currency_id' => $request->data['currency_id'],
			'user_id' => $request->data['user_id']
		]);
		
		//we consider this a transaction so we have to insert a record to our Transactions table
		//make sure the transaction_type is set to 'new wallet'

	 	$userId = $request->data['user_id'];
  	$categoryId = 0;

    $timestamp = Carbon::now();
  	$date = Carbon::createFromFormat('Y-m-d H:i:s', $timestamp, 'PST');
    $date->setTimezone('UTC');

    $transactionStatus = 'completed'; //[pending, completed]
    $transactionDate = $date;
    $transactionType = 'new wallet';

    Transaction::create([
      'wallet_id' => $wallet->wallet_id,
      'transaction_type' => $transactionType,
      'amount' => $request->data['initial_balance'] * 100,
      'transaction_date' => $transactionDate,
      'note' => 'New wallet created with initial balance of '.$request->data['initial_balance'],
      'transaction_status' => $transactionStatus,
      'category_id' => $categoryId,
      'currency_id' => $request->data['currency_id'],
      'user_id' => $userId
    ]);

		return response()->json('  Added Successfully! ');
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

	
	public function update(Request $request, $id)
	{
		try {

			$wallet = Wallet::findOrFail($id);

			$input = $request->all();

			$input['data']['current_balance'] = $input['data']['current_balance'] * 100;

			$res = $wallet->fill($input['data'])->save();

			return response()->json(['status' => 'success', 'message' => 'Wallet has been Successfully updated.']);
		
		} catch(ModelNotFoundException $e) {
			return response()->json(['status' => 'fail', 'message' => 'Unable to update wallet. Please try again.']);
		}
	}

	public function destroy(Request $request, $id)
	{

		$input = $request->all();

		$walletId = $input['walletId'];
		$userId = $input['userId'];

		try {

			$matches = [
				'wallet_id' => $walletId,
				'user_id' => $userId
			];

			$wallet = Wallet::where($matches);
			$wallet->delete();

			return response()->json(['status' => 'success', 'message' => 'Your wallet has been successfully deleted.']);
		
		} catch(ModelNotFoundException $e) {
			return response()->json(['status' => 'fail', 'message' => 'Unable to delete wallet. Please try again.']);
		}
	}
}
