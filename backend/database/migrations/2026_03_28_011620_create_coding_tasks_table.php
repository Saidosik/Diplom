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
        Schema::create('coding_tasks', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->unsignedBigInteger('order');
            $table->foreignId('lesson_block_id')->references('id')->on('lesson_blocks')->constrained()->onDelete('cascade');
            $table->enum('status', ['off', 'visible']);
            $table->json('standart_code');
            $table->string('cpu_limits');
            $table->unsignedInteger('time_limit');    // миллисекунды
            $table->unsignedInteger('memory_limit');  // мегабайты
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coding_tasks');
    }
};
