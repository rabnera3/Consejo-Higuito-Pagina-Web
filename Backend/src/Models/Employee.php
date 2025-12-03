<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class Employee extends Model
{
    protected $table = 'employees';

    protected $fillable = [
        'user_id',
        'full_name',
        'job_title',
        'department_id',
        'municipio',
        'email',
        'phone',
        'photo_url',
        'cedula',
        'hire_date',
        'vacation_days_balance',
        'employment_status',
        'address',
        'emergency_contact_name',
        'emergency_contact_phone',
        'birth_date',
        'gender',
    ];

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
