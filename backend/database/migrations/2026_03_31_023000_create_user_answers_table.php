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
         Schema::create('user_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('test_attempt_id')->references('id')->on('test_attempts')->constrained()->onDelete('cascade');
            $table->foreignId('question_id')->references('id')->on('questions')->constrained()->onDelete('cascade');
            $table->enum('status', ['not_correct', 'correct']);
            $table->jsonb('content');
            $table->softDeletes();
            $table->timestamps();

            $table->index('test_attempt_id', 'question_id');  // Для фильтрации
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_answers');
    }
};
