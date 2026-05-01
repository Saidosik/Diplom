<?php

namespace App\Http\Controllers\Api\Publication;

use App\Http\Controllers\Controller;
use App\Http\Requests\Publication\IndexPublicationRequest;
use App\Http\Resources\PublicationResource;
use App\Models\Publication;
use Illuminate\Http\Request;

class PublicationController extends Controller
{
    public function index(IndexPublicationRequest $request){
        $query = Publication::query()
        ->published()
        ->with('author')
        ->latest('published_at')
        ->get();


        return PublicationResource::collection($query);

    }

    public function show(Request $request, $publication){
        $query = Publication::query()
        ->published()
        ->with(['author', 'blocks'])
        ->where('slug', $publication)
        ->firstOrFail();
        return new PublicationResource($query);

    }


}
