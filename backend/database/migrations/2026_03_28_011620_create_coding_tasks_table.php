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
            $table->unsignedBigInteger('sort_order');
            $table->foreignId('lesson_block_id')->references('id')->on('lesson_blocks')->constrained()->onDelete('cascade');
            $table->enum('status', ['off', 'visible']);
            $table->jsonb('standart_code');
            $table->string('cpu_limit');
            $table->unsignedInteger('time_limit');
            $table->unsignedInteger('ram_limit');
            $table->softDeletes();
            $table->timestamps();

            $table->index(['lesson_block_id', 'sort_order']);
            $table->index(['lesson_block_id','status']);
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

