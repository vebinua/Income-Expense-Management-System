<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

use JWTAuth;
use DB;
use Tymon\JWTAuth\Exceptions\JWTException;

class UserController extends Controller
{

 	public function __construct() {
    //$this->middleware('jwt.verify', ['except' => ['login', 'store', 'create']]);
  }


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
	public function create($request)
	{   
		$data = $request['account'];
		
		return User::create([
			'first_name' => $data['first_name'],
			'last_name' => $data['last_name'],
			'email_address' => $data['email_address'],
			'password' => Hash::make($data['password'])
		]);

  }

  private function callDefaults($userId) {
    //create default categories for user here
    DB::table('categories')->insert([
        ['category' => 'Bills & Utilities', 'account_type' => 'liability', 'user_id' => $userId],
        ['category' => 'Salary', 'account_type' => 'asset', 'user_id' => $userId]
    ]);
  }

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function store(Request $request)
	{


		$res= $this->create($request->all());

    if ($res->user_id) {
      $this->callDefaults($res->user_id);
    }
    
    return response()->json(['status' => 'success', 'message' => 'Registration succesful!', 'userId' => $res->user_id]);      
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

	public function login(Request $request) {
 		
 		//$credentials = $request->only('email_address', 'password');
    
    $data = $request['data'];
    
    $token = null;
    
    /*if (! $token = auth('api')->attempt($data)) {
      return response()->json(['error' => 'Unauthorized', 'data_creds' => $data], 401);
    }*/

      	try {
            if (!$token = JWTAuth::attempt($data)) {
                return response()->json(['invalid_email_or_password'], 422);
            }
        } catch (JWTAuthException $e) {
            return response()->json(['failed_to_create_token'], 500);
        }

        return $this->createNewToken($token);


        //return response()->json(compact('token'));

    //return $token;
    //return $this->createNewToken($token);

    //return response()->json('login credentials: ' . print_r($credentials));
        /*try {
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['invalid_email_or_password'], 422);
            }
        } catch (JWTAuthException $e) {
            return response()->json(['failed_to_create_token'], 500);
        }
        return response()->json(compact('token'));*/
	}



  /**
   * Get the token array structure.
   *
   * @param  string $token
   *
   * @return \Illuminate\Http\JsonResponse
   */
  protected function createNewToken($token){
      return response()->json([
          'access_token' => $token,
          'token_type' => 'bearer',
          'expires_in' => auth()->factory()->getTTL() * 60,
          'user' => auth()->user()
      ]);
  }
}
