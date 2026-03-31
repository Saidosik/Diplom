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
        Schema::create('progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->references('id')->on('users')->constrained()->onDelete('cascade');
            $table->enum('status', ['opened', 'passed']);
            $table->foreignId('lesson_block_id')->references('id')->on('lesson_blocks')->constrained()->onDelete('cascade');
            $table->softDeletes();
            $table->timestamps();

            // Индексы
            $table->unique(['user_id', 'lesson_block_id']);  // Один прогресс на пользователя на блок
            $table->index(['lesson_block_id','user_id', 'status']);
            $table->index(['lesson_block_id','user_id']);   // Для подсчёта прогресса
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('progress');
    }
};
