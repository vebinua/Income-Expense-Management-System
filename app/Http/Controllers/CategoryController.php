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
			'user_id' => $request->data['user_id'],
			'parent_id' => $request->data['parent_id']
		]);
		
		return response()->json('  Added Successfully! ');
	}

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

	private function _remapCategoryWithSub($data) {

		$collectionArray = [];
		//structure should be like:
		/*[1] => {
		  ['parent'] = 'B & U',
		  [child] => {
		    Internet'
		  }
		},
		[11] => {
		  ['parent'] => 'What went wrong',
		  ['child'] => {
		    'went wrong what',
		    'yet another wrong'
		  }
		},
		[12] => {
		  ['parent'] => 'lost'
		}*/

		foreach ($data as $key => $cat) {
			$categoryId = $cat['category_id'];
			$subcategoryId = $cat['subcategory_id'];

			$collectionArray[$categoryId]['parent_cat'] = $cat['category'];

			if (isset($cat['subcategory'])) {
				$subcat = ($cat['subcategory'] !== null) ? $cat['subcategory'] : '';
				$collectionArray[$categoryId]['child_cat'][$subcategoryId] = $subcat;
			}

			//echo $key . ' -> ' . $cat['category_id'] . ' ' . $cat['category'] . ', ' . $cat['subcategory'] . '<br>';
		}

		return $collectionArray;
	}

	private function _remapCategoryWithSubOptimized($data) {

		$collectionArray = [];
		$itemArray = [];
		//structure should be like:
		/*[1] => {
		  ['parent'] = 'B & U',
		  [child] => {
		    Internet'
		  }
		},
		[11] => {
		  ['parent'] => 'What went wrong',
		  ['child'] => {
		    'went wrong what',
		    'yet another wrong'
		  }
		},
		[12] => {
		  ['parent'] => 'lost'
		}*/

		foreach ($data as $key => $cat) {
			$categoryId = $cat['category_id'];
			$subcategoryId = $cat['subcategory_id'];

			//echo $key . ' -> ' . $cat['category_id'] . ' ' . $cat['category'] . ', ' . $cat['subcategory'] . '<br>';
		}

		return $collectionArray;
	}

	public function showWithSub($userId, $accountType) {

		$categories = Category::where('user_id', $userId)->where('account_type', $accountType)->get();

		return $categories;

	}

	/*public function showWithSub($userId, $accountType)
	{ 
		try {

			 $user = Auth::user();
			 
			 // check if currently authenticated user is the owner of the category
	    if ($user->user_id !== (int) $userId) {
	    	return response()->json(['error' => 'You can only view your own categories.'], 403);
	    }

			$selectArray = [
				'categories.category_id',
		 		'categories.category',
		 		'subcategories.subcategory',
		 		'subcategories.subcategory_id',
		 		'categories.account_type'
	 		];

	 		$categories = Category::
    		leftjoin('subcategories', 'subcategories.category_id', '=', 'categories.category_id')
    		->select($selectArray)
    		->where('categories.user_id', $userId)
    		->where('categories.account_type', $accountType)->get()
    		->map(function($data) {
		      if ( ! $data->subcategory) {
          	$data->subcategory = '';
		      }

		      return $data;
		    });
	    
    	//return $this->_remapCategoryWithSub($categories);
    	return $categories;

	  } catch(ModelNotFoundException $e) {
			return response()->json(['status' => 'fail', 'message' => $e]);   
		}	  
	  
	}*/

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

	public function getUserCategory($categoryId, $userId) {

		try {

	  	$category = Category::where('category_id', $categoryId)->where('user_id', $userId)->first();

	  	return $category;
		
		} catch(ModelNotFoundException $e) {
			return response()->json(['status' => 'fail on getting user category', 'message' => $e]);   
		}	

	}

	public function getUserCategoriesByType($type, $userId) {
		try {

			$categories = Category::where('user_id', $userId)->where('account_type', $type)->where('parent_id', 0)->get();

  		return $categories;
		
		} catch(ModelNotFoundException $e) {
			return response()->json(['status' => 'fail', 'message' => $e]);   
		}	  
	}

	/*public function showByUserWithType($id, $type)
	{ 

		try {

		  		$categories = Category::where('user_id', $id)->where('account_type', $type)->get();

		  		//var_dump($categories);
		  		return $categories;
		
		} catch(ModelNotFoundException $e) {
			return response()->json(['status' => 'fail', 'message' => $e]);   
		}	  
	}*/


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
