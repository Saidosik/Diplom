<?php

namespace App\Policies;

use App\Models\Course;
use App\Models\User;

class CoursePolicy
{

    public function viewAny(?User $user): bool
    {
    return true;
    }

    public function view(?User $user, Course $course){
        if($course->isPublished()){
            return true;
        }
        if(!$user){
            return false;
        }

        return $user->isAdmin() || $user->id === $course->author_id;
    }

    public function create(User $user): bool
    {
        return true;
    }

     public function update(User $user, Course $course): bool
    {
        return  $user->id === $course->author_id;
    }

    public function delete(User $user, Course $course): bool
    {
        return $user->id === $course->author_id;
    }

    public function publish(User $user, Course $course): bool
    {
        return  $user->id === $course->author_id;
    }

    public function adminViewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function forceStatus(User $user, Course $course): bool
    {
        return $user->isAdmin();
    }
}
