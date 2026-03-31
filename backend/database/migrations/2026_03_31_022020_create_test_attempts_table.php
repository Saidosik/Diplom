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
        Schema::create('test_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('test_id')->references('id')->on('tests')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->references('id')->on('users')->constrained()->onDelete('cascade');
            // $table->string('icon');
            $table->softDeletes();
            $table->timestamps();

            $table->index(['test_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('test_attempts');
    }
};
