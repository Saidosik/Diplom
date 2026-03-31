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
        Schema::create('modules', function (Blueprint $table) {
            $table->id();
            $table->string('name',255);
            $table->unsignedBigInteger('sort_order');
            $table->string('description')->nullable();
            $table->foreignId('course_id')->references('id')->on('courses')->constrained()->onDelete('cascade');
            $table->enum('status',['off', 'visible']);
            //$table->string('prewiew');
            //$table->string('icon');
            $table->softDeletes();
            $table->timestamps();

            $table->index(['course_id', 'status']);  
            $table->index(['course_id', 'sort_order']);  
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('modules');
    }
};

