"use client";
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { browserApi } from '@/lib/http/browser';

function VerifyEmail() {
    const searchParams = useSearchParams();
    const [resultMessage, setResultMessage] = useState('')
    const [error, setError] = useState(false)
    const router = useRouter();
    useEffect(() => {
        const verify = async () => {
            const id = searchParams.get('id')
            const expires = searchParams.get('expires')
            const signature = searchParams.get('signature')
            try {
                const response = await browserApi.get("/auth/verify-email/", {
                    params: { id, expires, signature }
                });
                setResultMessage(response.data.message)


            } catch {
                setResultMessage("Ошибка верификации")
                setError(true)
            }
        };
        verify();
    }, [searchParams, router]);

    return (
        <div>
            {resultMessage}
        </div>
    )
}

export default function VerifyEmailPage() {
    return (
        // Обертка Suspense обязательна
        <Suspense fallback={<div>Загрузка...</div>}>
            <VerifyEmail />
        </Suspense>
    );
}

