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
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->references('id')->on('users')->constrained()->onDelete('cascade');
            $table->morphs('commentable');
            $table->foreignId('parent_comment_id')
                ->nullable()
                ->constrained('comments')
                ->nullOnDelete();

            $table->jsonb('content');
            $table->enum('status', ['banned', 'visible']);
            $table->softDeletes();
            $table->timestamps();

            // Индексы
            $table->index(['commentable_id', 'user_id']);  // Для фильтрации
            $table->index('parent_comment_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
