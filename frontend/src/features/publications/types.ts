import { CSSProperties } from "react"
import { BundledLanguage, LanguageInput, SpecialLanguage } from "shiki"


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
    blocks?: PublicationBlockContent[]
}

export type PublicationAuthor = {
    name: string
}

type BaseBlock<P, T extends string> = {
    id: number;
    sort_order: number;
    type: T;
    properties: P;
};


export type HeadingBlockContent   = BaseBlock<HeadingBlock, 'heading'>;
export type ParagraphBlockContent = BaseBlock<ParagraphBlock, 'paragraph'>;
export type CodeBlockContent      = BaseBlock<CodeBlock, 'code'>;
export type LinkBlockContent      = BaseBlock<LinkBlock, 'link'>;
export type MarkdownBlockContent  = BaseBlock<MarkdownBlock, 'markdown'>;
export type ImageBlockContent     = BaseBlock<ImageBlock, 'image'>;
export type VideoBlockContent     = BaseBlock<VideoBlock, 'video'>;
export type DividerBlockContent   = BaseBlock<DividerBlock, 'divider'>;
export type ImportantBlockContent = BaseBlock<ImportantBlock, 'important'>;
export type QuoteBlockContent     = BaseBlock<QuoteBlock, 'quote'>;
export type WarningBlockContent   = BaseBlock<WarningBlock, 'warning'>;

export type PublicationBlockContent = 

    | HeadingBlockContent
    | ParagraphBlockContent
    | CodeBlockContent

    | LinkBlockContent
    | MarkdownBlockContent
    | ImageBlockContent

    | VideoBlockContent
    | DividerBlockContent
    | ImportantBlockContent

    | QuoteBlockContent
    | WarningBlockContent;

export type PublicationQuery = {
    type?: PublicationType;
    search?: string;
    per_page?: number;
};

export type PublicationSlug = {
    slug: string;
};


type HeadingBlock = {
    text: string,
    level: number,
}

type ParagraphBlock = {
    text: string,
}

type MarkdownBlock = {
    text: string,
    markdown: number,
}

type ImageBlock = {
    caption: string,
    src: string,
    url: string,
    alt: string
}
type VideoBlock = {
    title: string,
    url: string,
    provider: string,
}
export type CodeBlock = {
    filename: string,
    language: BundledLanguage | LanguageInput | SpecialLanguage,
    code: string,
}

type ImportantBlock ={
    text: string,
    title: string
}

type QuoteBlock = {
    text: string,
    author: string
}

type WarningBlock = {
    title: string,
    text: string,
}

type LinkBlock = {
    title: string,
    url: string,
    description: string,
}

type DividerBlock = {
    style?: Record<string, string | number>; // CSS-свойства в camelCase
};