<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Http\Resources\Category as CategoryResource;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;


class CategoryController extends Controller
{ 

    public function __construct() {
       $this->middleware('auth:api', ['except' => ['index']]);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
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
        CategoryResource::withoutWrapping();
        return new CategoryResource(Category::findOrFail($id));
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
            $category->fill($input)->save();

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
    public function destroy($id)
    {
        $category = Category::findOrFail($id);

        $category->delete();

        return response()->json(['status' => 'success', 'message' => 'Category has been Successfully deleted.']);
    }
}
