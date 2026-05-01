

export type PublicationType = 'article' | 'news' | 'post' | 'guide'
export type PublicationStatus = 'draft' | 'published' | 'archived' | 'hidden'
export type PublicationBlockType = 'heading'
    | 'paragraph'
    | 'markdown'
    | 'image'
    | 'video'
    | 'code'
    | 'important'
    | 'quote'
    | 'warning'
    | 'link'
    | 'divider'

export type PublicationBlock = {
    id: number,
    type: PublicationBlockType,
    sort_order: number,
    content: Record<string, unknown>
}

export type Publication = {
    id: number,
    type: PublicationType,
    status: PublicationStatus,
    title: string,
    slug: string,
    excerpt: string | null;
    cover_image_path: string | null;
    reading_time_minutes: number | null,
    created_at: string;
    updated_at: string;
    published_at: string | null;

    author: PublicationAuthor
    blocks?: PublicationBlock[]
}

export type PublicationAuthor = {
    name: string
}

export type PublicationQuery = {
    type?: PublicationType;
    search?: string;
    per_page?: number;
};