<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @property int         $id
 * @property string      $name
 * @property string      $email
 * @property string      $password_hash
 * @property int|null    $role_id
 * @property int|null    $department_id
 * @property string|null $last_login
 */
final class User extends Model
{
    protected $table = 'users';

    protected $fillable = [
        'name',
        'email',
        'password_hash',
        'role_id',
        'department_id',
        'status',
    ];

    protected $hidden = [
        'password_hash',
    ];

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function employee(): HasOne
    {
        return $this->hasOne(Employee::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }
}
