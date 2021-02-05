<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Http\Resources\Category as CategoryResource;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;
use JWTAuth;

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
	public function show($userId)
	{ 
		try {

			 $user = Auth::user();
			 
			 // check if currently authenticated user is the owner of the category
	    if ($user->user_id !== (int) $userId) {
	    	return response()->json(['error' => 'You can only view your own categories.'], 403);
	    }

	    $categories = Category::where('user_id', $userId)->get();

	    return $categories;
		
		} catch(ModelNotFoundException $e) {
			return response()->json(['status' => 'fail', 'message' => $e]);   
		}	  
	  
	}

	public function showByUserWithCategoryId($userId, $categoryId) {
		try {

	  	$category = Category::where('user_id', $userId)->where('category_id', $categoryId)->get();

	  	return $category;
		
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

		public function showByUserWithType($id, $type)
	{ 

		try {

		  		$categories = Category::where('user_id', $id)->where('account_type', $type)->get();

		  		return $categories;
		
		} catch(ModelNotFoundException $e) {
			return response()->json(['status' => 'fail', 'message' => $e]);   
		}	  
	}


	public function edit($id)
	{
		//we don't need this since we'll be showing the edit form in a react component view
	}

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
