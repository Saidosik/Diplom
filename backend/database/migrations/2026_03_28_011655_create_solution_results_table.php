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
        Schema::create('solution_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('solution_id')->references('id')->on('solutions')->constrained()->onDelete('cascade');
            $table->foreignId('coding_task_test_case_id')->references('id')->on('coding_task_test_cases')->constrained()->onDelete('cascade')->nullable();
            $table->enum('status',[ 'passed', 'failed', 'runtime_error', 'compilation_error', 'time_limit_error', 'memory_limit_error']);
            $table->enum('type', ['test_case', 'user_input']);
            $table->jsonb('output');
            $table->jsonb('input')->nullable();
            $table->jsonb('error_message')->nullable();
            $table->unsignedBigInteger('memory_usage');
            $table->unsignedBigInteger('execution_time');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('solution_results');
    }
};
