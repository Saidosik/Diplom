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
        Schema::create('tests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lesson_block_id')->references('id')->on('lesson_blocks')->constrained()->onDelete('cascade');
            $table->string('name', 255);
            $table->string('description')->nullable();
            $table->unsignedBigInteger('order');
            $table->enum('status', ['off', 'visible']);
            // $table->string('icon');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tests');
    }
};
