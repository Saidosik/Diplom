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
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->string('name',255);
            $table->string('slug')->unique();
            $table->unsignedBigInteger('sort_order');
            $table->string('description')->nullable();
            $table->foreignId('module_id')->references('id')->on('modules')->constrained()->onDelete('cascade');
            $table->enum('status',['off', 'visible']);
            //$table->string('prewiew');
            //$table->string('icon');
            $table->softDeletes();
            $table->timestamps();

            $table->index(['module_id', 'status']);  
            $table->index(['module_id','sort_order']);  
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lessons');
    }
};

