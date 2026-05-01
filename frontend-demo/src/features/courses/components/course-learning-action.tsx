'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useMeQuery } from '@/features/auth/hooks';
import {
    enrollCourse,
    getCourseEnrollment,
} from '../api';
import type { Course } from '../types';
import { getContinueLearningHref, getFirstLessonHref } from '../utils';

export function CourseLearningAction({ course }: { course: Course }) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { data: user } = useMeQuery();

    const firstLessonHref = getFirstLessonHref(course);

    const enrollmentQuery = useQuery({
        queryKey: ['course-enrollment', course.slug],
        queryFn: () => getCourseEnrollment(course.slug),
        enabled: Boolean(user),
        retry: false,
    });

    const enrollMutation = useMutation({
        mutationFn: () => enrollCourse(course.slug),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['course-enrollment', course.slug],
            });

            await queryClient.invalidateQueries({
                queryKey: ['my-learning'],
            });

            if (firstLessonHref) {
                router.push(firstLessonHref);
            }
        },
    });

    if (!user) {
        return (
            <Button asChild className="w-full">
                <Link href="/auth?mode=login">
                    Войти и начать обучение
                    <ArrowRight className="size-4" />
                </Link>
            </Button>
        );
    }

    if (enrollmentQuery.isLoading) {
        return (
            <Button className="w-full" disabled>
                <Loader2 className="size-4 animate-spin" />
                Проверяем запись
            </Button>
        );
    }

    if (enrollmentQuery.data) {
        const continueHref =
            getContinueLearningHref(enrollmentQuery.data) ?? firstLessonHref ?? `/courses/${course.slug}`;

        return (
            <Button asChild className="w-full">
                <Link href={continueHref}>
                    <CheckCircle2 className="size-4" />
                    Продолжить обучение
                </Link>
            </Button>
        );
    }

    return (
        <Button
            type="button"
            className="w-full"
            disabled={!firstLessonHref || enrollMutation.isPending}
            onClick={() => enrollMutation.mutate()}
        >
            {enrollMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
            ) : (
                <ArrowRight className="size-4" />
            )}
            Начать обучение
        </Button>
    );
}