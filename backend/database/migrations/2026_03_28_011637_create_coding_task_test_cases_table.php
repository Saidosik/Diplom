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
        Schema::create('coding_task_test_cases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('coding_task_id')->references('id')->on('coding_tasks')->constrained()->onDelete('cascade');
            $table->enum('status',['hidden', 'visible', 'off']);
            $table->unsignedBigInteger('sort_order');
            $table->jsonb('output');
            $table->jsonb('input');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coding_task_test_cases');
    }
};

