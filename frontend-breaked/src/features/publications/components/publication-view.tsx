'use client'

import React from "react";
import { useEffect, useState } from "react";
import { getPublicationDetail } from "../api";
import { Publication, PublicationSlug } from "../types";
import PublicationBlockRender from "./publication-block-renderer";

export function PublicationView(slug: PublicationSlug) {
    const [publications, setPublications] = useState<Publication>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        async function loadPublication() {
            try {
                setIsLoading(true);

                const data = await getPublicationDetail(slug);
                
                setPublications(data );
            } catch (error) {
                setError('Не удалось загрузить публикации : ' + error);
            } finally {
                setIsLoading(false);
            }
        }

        loadPublication();
    }, [])
    if (isLoading) {
        return <div>Загрузка публикаций...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <p>{publications?.excerpt}</p>
            {PublicationBlockRender(publications.blocks)}
        </div>
    );
}