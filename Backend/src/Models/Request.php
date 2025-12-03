<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Request extends Model
{
    protected $table = 'requests';

    protected $fillable = [
        'employee_id',
        'type',
        'description',
        'status',
        'rejection_reason',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
