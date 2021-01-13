<?php

    namespace App\Http\Middleware;

    use Closure;
    use JWTAuth;
    use Exception;
    use Tymon\JWTAuth\Http\Middleware\BaseMiddleware;


    class JwtMiddleware extends BaseMiddleware
    {

        /**
         * Handle an incoming request.
         *
         * @param  \Illuminate\Http\Request  $request
         * @param  \Closure  $next
         * @return mixed
         */
        public function handle($request, Closure $next)
        {
            try {
                $user = JWTAuth::parseToken()->authenticate();
            } catch (Exception $e) {
                if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenInvalidException){
                    return response()->json(['status' => 'Token is Invalid', 'action' =>'JWT_FAIL_TOKEN_INVALID']);
                }else if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenExpiredException){
                    return response()->json(['status' => 'Token is Expired', 'action' =>'JWT_FAIL_TOKEN_EXPIRED']);
                }else{
                    return response()->json(['status' => 'Authorization Token not found', 'action' =>'JWT_FAIL_TOKEN_MISSING']);
                }
            }
            return $next($request);
            //return false; //$next($request);
        }
    }