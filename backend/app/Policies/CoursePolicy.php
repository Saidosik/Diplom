<?php

namespace App\Policies;

use App\Enums\CourseStatus;
use App\Models\Course;
use App\Models\User;

class CoursePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(?User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(?User $user, Course $course): bool
    {
        if($course->status === CourseStatus::Published){
            return true;
        }
        return $user !== null
        && $user->id === $course->author_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true; 
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Course $course): bool
    {
        return $user->id === $course->author_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Course $course): bool
    {
        return $user->id === $course->author_id;  
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Course $course): bool
    {
        return $user->id === $course->author_id;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Course $course): bool
    {
        return $user->id === $course->author_id;
    }
}
