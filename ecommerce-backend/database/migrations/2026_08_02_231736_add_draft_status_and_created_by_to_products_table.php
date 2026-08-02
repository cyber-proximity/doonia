<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE products MODIFY COLUMN status ENUM('draft','pending_review','active','inactive') NOT NULL DEFAULT 'draft'");

        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('created_by')->nullable()->after('featured')->constrained('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropConstrainedForeignId('created_by');
        });

        DB::statement("ALTER TABLE products MODIFY COLUMN status ENUM('active','inactive') NOT NULL DEFAULT 'active'");
    }
};
