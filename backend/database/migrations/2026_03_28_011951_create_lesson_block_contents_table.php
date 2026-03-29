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
        Schema::create('lesson_block_contents', function (Blueprint $table) {
            $table->id();
             $table->unsignedBigInteger('order');
            $table->foreignId('lesson_block_id')->references('id')->on('lesson_blocks')->constrained()->onDelete('cascade');
            $table->enum('status',['off', 'visible']);
            $table->enum('type',['text', 'heading', 'warning', 'important', 'clue', 'video', 'example', 'link', 'danger']);
            $table->jsonb('content');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lesson_block_contents');
    }
};
