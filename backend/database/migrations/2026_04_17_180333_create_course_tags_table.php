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
         Schema::create('course_tags', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->references('id')->on('courses')->constrained()->onDelete('cascade');
            $table->foreignId('tag_id')->references('id')->on('tags')->constrained()->onDelete('cascade');
            $table->timestamps();

            $table->unique(['course_id', 'tag_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
