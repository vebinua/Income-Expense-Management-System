<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class Category extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
         return [
            'category_id'         => $this->category_id,
            'category'       => $this->category,
            'account_type'    => $this->account_type,
            'user_id'     => (int) $this->user_id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];

        
    }
}
