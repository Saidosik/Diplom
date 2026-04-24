<?php

namespace App\Policies;

use App\Models\Lesson;
use App\Models\Module;
use App\Models\User;

class LessonPolicy
{
    public function create(User $user, Module $module): bool
    {
        return $user->isAdmin() || $user->id === $module->course->author_id;
    }

    public function update(User $user, Lesson $lesson): bool
    {
        return $user->isAdmin() || $user->id === $lesson->module->course->author_id;
    }

    public function delete(User $user, Lesson $lesson): bool
    {
        return $user->isAdmin() || $user->id === $lesson->module->course->author_id;
    }
}