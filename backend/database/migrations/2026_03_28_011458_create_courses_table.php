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
            $table->string('slug')->unique();
            $table->string('description')->nullable();
            $table->enum('status',['off', 'published', 'banned','draft', 'on_moderation']);
            $table->integer('price')->nullable();
            $table->foreignId('author_id')->references('id')->on('users')->constrained()->onDelete('cascade');
            //$table->string('source');
            //$table->string('image');
            //$table->string('prewiew');
            //$table->string('icon');
            $table->softDeletes();
            $table->timestamps();

            // Индексы
            $table->index('status');  // Для фильтрации видимых курсов
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
