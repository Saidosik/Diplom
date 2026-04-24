<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    //подключаем расширение для триграмм
    /**
     * Run the migrations.
     */
    public function up(): void
    {

        DB::statement('CREATE EXTENSION IF NOT EXISTS pg_trgm');
        DB::statement('CREATE INDEX courses_name_trgm_idx ON courses USING GIN (name gin_trgm_ops)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP INDEX IF EXISTS courses_name_trgm_idx');
        DB::statement('DROP EXTENSION IF EXISTS pg_trgm');
    }
};
