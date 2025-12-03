<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int         $id
 * @property int         $employee_id
 * @property string|null $project_name
 * @property string      $location
 * @property string      $visit_date
 * @property string      $objectives
 * @property string      $findings
 * @property string|null $agreements
 * @property string      $created_at
 * @property string      $updated_at
 */
final class VisitReport extends Model
{
    protected $table = 'visit_reports';

    protected $fillable = [
        'employee_id',
        'project_name',
        'location',
        'visit_date',
        'objectives',
        'findings',
        'agreements',
    ];

    protected $casts = [
        'visit_date' => 'date',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function photos(): HasMany
    {
        return $this->hasMany(VisitReportPhoto::class);
    }
}
