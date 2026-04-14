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
        Schema::create('lesson_blocks', function (Blueprint $table) {
            $table->id();
            $table->string('name',255);
            $table->string('slug')->unique();
            $table->unsignedBigInteger('sort_order');
            $table->string('description')->nullable();
            $table->foreignId('lesson_id')->references('id')->on('lessons')->constrained()->onDelete('cascade');
            $table->enum('status',['off', 'visible']);
            $table->enum('type',['theory', 'test', 'coding_task']);
            //$table->string('prewiew');
            //$table->string('icon');
            $table->softDeletes();
            $table->timestamps();

            $table->index(['lesson_id', 'status']);
            $table->index(['type', 'status']); 
            $table->index(['lesson_id', 'sort_order']);  
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lesson_blocks');
    }
};

