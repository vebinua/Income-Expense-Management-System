<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Http\Resources\Category as CategoryResource;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;

header('Access-Control-Allow-Methods : POST, GET, OPTIONS, PUT, DELETE, HEAD');
header('Allow: POST, GET, OPTIONS, PUT, DELETE, HEAD');
header('Access-Control-Allow-Headers : X-Requested-With, Content-Type');

class CategoryController extends Controller
{ 

	public function __construct() {

	}

	/**
	 * Display a listing of the resource.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index($id)
	{ 
		$categories = Category::all();

		return $categories->toJson();
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
		//implement validation later
		/*$validatedData = $request->validate([
		  'category' => 'required',
		  'account_type' => 'required',
		  'user_id' => 'required'
		]);*/
 
		Category::create([
			'category' => $request->data['category'],
			'account_type' => $request->data['account_type'],
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

		try {

			 	CategoryResource::withoutWrapping();
				return new CategoryResource(Category::findOrFail($id));
		
		} catch(ModelNotFoundException $e) {
			return response()->json(['status' => 'fail', 'message' => $e]);   
		}
	  
	}

	public function showByUser($id)
	{ 

		try {

		  		$categories = Category::where('user_id', $id)->get();

		  		return $categories;
		
		} catch(ModelNotFoundException $e) {
			return response()->json(['status' => 'fail', 'message' => $e]);   
		}	  
	}

	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function edit($id)
	{
		//we don't need this since we'll be showing the edit form in a react component view
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
		try {

			$category = Category::findOrFail($id);

			$input = $request->all();
			$res = $category->fill($input['data'])->save();

			return response()->json(['status' => 'success', 'message' => 'Category has been Successfully updated.']);
		
		} catch(ModelNotFoundException $e) {
			return response()->json(['status' => 'fail', 'message' => 'Unable to update category. Please try again.']);
		}
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
		$userId = $input['userId'];

		try {

			$matches = [
				'category_id' => $id,
				'user_id' => $userId
			];

			$category = Category::where($matches);
			$category->delete();

			return response()->json(['status' => 'success', 'message' => 'Category has been Successfully deleted.']);
		
		} catch(ModelNotFoundException $e) {
			return response()->json(['status' => 'fail', 'message' => 'Unable to delete category. Please try again.']);
		}
	}
}
