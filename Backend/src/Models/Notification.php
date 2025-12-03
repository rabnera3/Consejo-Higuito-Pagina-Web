<?php
declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $table = 'notifications';
    
    protected $fillable = [
        'user_id',
        'type',
        'title',
        'message',
        'data',
        'read_at'
    ];

    protected $casts = [
        'data' => 'array',
        'read_at' => 'datetime',
        'created_at' => 'datetime'
    ];
    
    public $timestamps = false; // We only have created_at, not updated_at by default in migration, but let's check.
    // Migration had created_at DEFAULT CURRENT_TIMESTAMP. Eloquent expects created_at and updated_at by default.
    // I should probably disable timestamps or add updated_at.
    // The migration: created_at DATETIME DEFAULT CURRENT_TIMESTAMP. No updated_at.
    // So I will set public $timestamps = false; and manually handle created_at if needed, or let DB handle it.
    
    public static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (!$model->created_at) {
                $model->created_at = $model->freshTimestamp();
            }
        });
    }
}
