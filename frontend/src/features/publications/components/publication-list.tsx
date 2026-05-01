'use client'

import { useEffect, useState } from "react";
import { getPublications } from "../api";
import { Publication } from "../types";
import { publicationCard } from "./publication-card";

export function PublicationList() {
    const [publications, setPublications] = useState<Publication[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadPublications() {
            try {
                setIsLoading(true);

                const data = await getPublications();

                setPublications(data);
            } catch (error) {
                setError('Не удалось загрузить публикации : ' + error);
            } finally {
                setIsLoading(false);
            }
        }

        loadPublications();
    }, [])
    if (isLoading) {
        return <div>Загрузка публикаций...</div>;
    }

    if (error) {
        return <div>{error}</div>;3
    }

    return (
        <div>
            {publicationCard(publications)}
        </div>
    );
}