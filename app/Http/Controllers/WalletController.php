<?php

namespace App\Http\Controllers;

use App\Models\Wallet;
use Illuminate\Http\Request;

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
		Wallet::create([
			'wallet_name' => $request->data['wallet_name'],
			'initial_balance' => $request->data['initial_balance'],
			'currency_id' => $request->data['currency_id'],
			'user_id' => $request->data['user_id']
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
