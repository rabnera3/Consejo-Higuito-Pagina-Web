<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int         $id
 * @property int         $employee_id
 * @property string|null $project_name
 * @property string      $log_date
 * @property string      $activity_description
 * @property string|null $observations
 * @property string|null $weather_conditions
 * @property string      $created_at
 * @property string      $updated_at
 */
final class FieldLog extends Model
{
    protected $table = 'field_logs';

    protected $fillable = [
        'employee_id',
        'project_name',
        'log_date',
        'activity_description',
        'observations',
        'weather_conditions',
    ];

    protected $casts = [
        'log_date' => 'date',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
