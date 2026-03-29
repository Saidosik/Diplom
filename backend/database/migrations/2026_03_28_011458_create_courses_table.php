<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('name',255);
            $table->string('description')->nullable();
            $table->enum('status',['off', 'visible', 'banned']);
            $table->string('price')->nullable();
            $table->string('author')->nullable();
            //$table->string('source');
            //$table->string('image');
            //$table->string('prewiew');
            //$table->string('icon');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
