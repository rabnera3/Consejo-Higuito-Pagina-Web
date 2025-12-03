<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int         $id
 * @property int         $visit_report_id
 * @property string      $photo_url
 * @property string|null $caption
 * @property string      $created_at
 */
final class VisitReportPhoto extends Model
{
    protected $table = 'visit_report_photos';

    public $timestamps = false;

    protected $fillable = [
        'visit_report_id',
        'photo_url',
        'caption',
    ];

    public function visitReport(): BelongsTo
    {
        return $this->belongsTo(VisitReport::class);
    }
}
