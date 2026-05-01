// app/publications/[slug]/page.tsx
import { getPublicationDetail } from '@/features/publications/api';
import { PublicationBlockRenderer } from '@/features/publications/components/publication-block-renderer';
import { PublicationSlug } from '@/features/publications/types';

export default async function PublicationPage({
    params,
}: {
    params: Promise<PublicationSlug>;
}) {
    const slug  = await params;   // ← обязательно await
        console.log(slug)

    const publication = await getPublicationDetail(slug);

    if (!publication) return <div>Публикация не найдена</div>;

    return (
        <main className="mx-auto max-w-3xl p-4">
            <h1 className="text-3xl font-bold">{publication.title}</h1>
            {publication.excerpt && (
                <p className="text-gray-600 dark:text-gray-400">{publication.excerpt}</p>
            )}
            <PublicationBlockRenderer blocks={publication.blocks ?? []} />
        </main>
    );
}