<?php

namespace Database\Seeders;

use App\Enums\PublicationBlockType;
use App\Enums\PublicationStatus;
use App\Enums\PublicationType;
use App\Models\Publication;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DemoPublicationSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('TRUNCATE TABLE publication_blocks, publications RESTART IDENTITY CASCADE');

        $authors = $this->seedAuthors();
        $publications = $this->publicationData();
        $richBlockSets = $this->richBlockSets();

        foreach ($publications as $index => $data) {
            $publication = Publication::query()->create([
                'author_id' => $authors[$index % $authors->count()]->id,
                'type' => $data['type'],
                'status' => $data['status'],
                'title' => $data['title'],
                'slug' => $data['slug'],
                'excerpt' => $data['excerpt'],
                'cover_image_path' => $data['cover_image_path'],
                'reading_time_minutes' => $data['reading_time_minutes'],
                'published_at' => $data['status'] === PublicationStatus::Published
                    ? now()->subDays(12 - $index)
                    : null,
            ]);

            $blocks = $index < 3
                ? $richBlockSets[$index]
                : $this->compactBlocks($data['title'], $index);

            foreach ($blocks as $blockIndex => $block) {
                $publication->blocks()->create([
                    'type' => $block['type'],
                    'sort_order' => ($blockIndex + 1) * 10,
                    'content' => $block['content'],
                ]);
            }
        }
    }

    private function seedAuthors()
    {
        $authorData = [
            [
                'name' => 'Test Author 1',
                'email' => 'publication-author1@gmail.com',
                'avatar' => '/images/avatars/author-1.webp',
            ],
            [
                'name' => 'Test Author 2',
                'email' => 'publication-author2@gmail.com',
                'avatar' => '/images/avatars/author-2.webp',
            ],
            [
                'name' => 'Test Author 3',
                'email' => 'publication-author3@gmail.com',
                'avatar' => '/images/avatars/author-3.webp',
            ],
        ];

        return collect($authorData)->map(function (array $author) {
            return User::query()->updateOrCreate(
                ['email' => $author['email']],
                [
                    'name' => $author['name'],
                    'password' => Hash::make('12345678'),
                    'role' => 'user',
                    'avatar' => $author['avatar'],
                    'email_verified_at' => now(),
                ]
            );
        })->values();
    }

    private function publicationData(): array
    {
        return [
            [
                'type' => PublicationType::Article,
                'status' => PublicationStatus::Published,
                'title' => 'Как устроить публикацию из блоков в учебной платформе',
                'slug' => 'publication-blocks-architecture',
                'excerpt' => 'Разбор блочной структуры публикации: заголовки, текст, код, изображения, предупреждения и ссылки.',
                'cover_image_path' => '/images/publications/publication-blocks-architecture.webp',
                'reading_time_minutes' => 8,
            ],
            [
                'type' => PublicationType::Post,
                'status' => PublicationStatus::Published,
                'title' => 'Заметка автора: почему прогресс лучше считать по блокам',
                'slug' => 'block-based-progress-note',
                'excerpt' => 'Короткая публикация о том, почему состояние каждого блока полезнее общего процента по уроку.',
                'cover_image_path' => '/images/publications/block-based-progress-note.webp',
                'reading_time_minutes' => 5,
            ],
            [
                'type' => PublicationType::Guide,
                'status' => PublicationStatus::Published,
                'title' => 'Гайд: безопасный вывод пользовательского контента',
                'slug' => 'safe-user-content-rendering-guide',
                'excerpt' => 'Практический материал о валидации, хранении и отображении пользовательского контента.',
                'cover_image_path' => '/images/publications/safe-user-content-rendering-guide.webp',
                'reading_time_minutes' => 9,
            ],
            [
                'type' => PublicationType::News,
                'status' => PublicationStatus::Published,
                'title' => 'Вектор получил раздел публикаций',
                'slug' => 'vektor-publications-section-release',
                'excerpt' => 'Новость о запуске раздела публикаций, где авторы смогут делиться материалами и заметками.',
                'cover_image_path' => '/images/publications/vektor-publications-section-release.webp',
                'reading_time_minutes' => 3,
            ],
            [
                'type' => PublicationType::Article,
                'status' => PublicationStatus::Draft,
                'title' => 'Черновик статьи: проектирование редактора блоков',
                'slug' => 'draft-block-editor-design',
                'excerpt' => 'Черновой материал для проверки личного кабинета автора и скрытия неопубликованных записей.',
                'cover_image_path' => null,
                'reading_time_minutes' => 7,
            ],
            [
                'type' => PublicationType::Article,
                'status' => PublicationStatus::Hidden,
                'title' => 'Скрытая статья: миграция старого контента',
                'slug' => 'hidden-old-content-migration',
                'excerpt' => 'Материал должен быть виден только автору или администратору, но не публичной ленте.',
                'cover_image_path' => '/images/publications/hidden-old-content-migration.webp',
                'reading_time_minutes' => 6,
            ],
            [
                'type' => PublicationType::Post,
                'status' => PublicationStatus::Draft,
                'title' => 'Черновик поста: идеи для обсуждений после урока',
                'slug' => 'draft-lesson-discussion-ideas',
                'excerpt' => 'Проверка чернового поста с минимальным набором блоков.',
                'cover_image_path' => null,
                'reading_time_minutes' => 4,
            ],
            [
                'type' => PublicationType::Post,
                'status' => PublicationStatus::Archived,
                'title' => 'Архивный пост: старый формат публикаций',
                'slug' => 'archived-old-publication-format',
                'excerpt' => 'Запись для проверки архивного состояния публикации.',
                'cover_image_path' => '/images/publications/archived-old-publication-format.webp',
                'reading_time_minutes' => 4,
            ],
            [
                'type' => PublicationType::News,
                'status' => PublicationStatus::Draft,
                'title' => 'Черновик новости: обновление кабинета автора',
                'slug' => 'draft-author-studio-update',
                'excerpt' => 'Заготовка новости для проверки фильтрации по статусам.',
                'cover_image_path' => null,
                'reading_time_minutes' => 2,
            ],
            [
                'type' => PublicationType::News,
                'status' => PublicationStatus::Hidden,
                'title' => 'Скрытая новость: технические работы',
                'slug' => 'hidden-maintenance-news',
                'excerpt' => 'Новость не должна попадать в публичный список.',
                'cover_image_path' => '/images/publications/hidden-maintenance-news.webp',
                'reading_time_minutes' => 2,
            ],
            [
                'type' => PublicationType::Guide,
                'status' => PublicationStatus::Hidden,
                'title' => 'Скрытый гайд: настройка локального окружения',
                'slug' => 'hidden-local-environment-guide',
                'excerpt' => 'Материал для проверки страницы просмотра скрытой публикации автором.',
                'cover_image_path' => '/images/publications/hidden-local-environment-guide.webp',
                'reading_time_minutes' => 10,
            ],
            [
                'type' => PublicationType::Guide,
                'status' => PublicationStatus::Archived,
                'title' => 'Архивный гайд: устаревший способ авторизации',
                'slug' => 'archived-old-auth-guide',
                'excerpt' => 'Запись для проверки архивных материалов и защиты публичного каталога.',
                'cover_image_path' => '/images/publications/archived-old-auth-guide.webp',
                'reading_time_minutes' => 8,
            ],
        ];
    }

    /**
     * Первые три опубликованные публикации содержат по одному примеру каждого типа блока.
     * В сумме получается 3 примера для каждого PublicationBlockType.
     */
    private function richBlockSets(): array
    {
        return [
            [
                $this->heading('Блочная публикация как основа редактора', 1),
                $this->paragraph('Публикация хранится как набор независимых блоков. Такой подход позволяет отдельно отрисовывать текст, код, изображения, предупреждения и служебные элементы.'),
                $this->markdown("### Что проверяет этот пример\n\n- поддержку markdown;\n- списки;\n- выделение важных терминов;\n- переносы строк."),
                $this->image('/images/publications/demo-editor-layout.webp', 'Схема редактора публикаций', 'Пример обложки или иллюстрации внутри материала.'),
                $this->video('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Видеоразбор редактора', 'youtube'),
                $this->code('php', "Schema::create('publication_blocks', function (Blueprint \$table) {\n    \$table->id();\n    \$table->foreignId('publication_id')->constrained()->cascadeOnDelete();\n    \$table->enum('type', PublicationBlockType::values());\n    \$table->jsonb('content');\n});", 'database/migrations/create_publication_blocks_table.php'),
                $this->important('Стабильный формат content', 'Для каждого типа блока лучше заранее договориться о структуре JSON. Тогда frontend-рендерер будет проще и безопаснее.'),
                $this->quote('Хороший интерфейс начинается не с красоты, а с предсказуемой структуры данных.', 'Команда Вектор'),
                $this->warning('Не выводи HTML напрямую', 'Если позже появится HTML-блок, его нужно очищать или рендерить через безопасный whitelist.'),
                $this->link('Документация Laravel по Eloquent Resources', 'https://laravel.com/docs/eloquent-resources', 'Полезно для стабильного API-ответа публикаций.'),
                $this->divider('solid'),
            ],
            [
                $this->heading('Прогресс, попытки и состояние блоков', 1),
                $this->paragraph('Когда материал разбит на блоки, можно точнее показывать пользователю, что он уже открыл, что решил правильно и где требуется повторная попытка.'),
                $this->markdown("## Пример логики\n\n`opened` — пользователь дошёл до блока.\n\n`solved` — пользователь успешно прошёл проверку."),
                $this->image('/images/publications/progress-dashboard.webp', 'Макет панели прогресса', 'Иллюстрация блока с прогрессом пользователя.'),
                $this->video('https://rutube.ru/video/demo-progress', 'Видео о прогрессе в уроках', 'rutube'),
                $this->code('ts', "type BlockState = 'opened' | 'incorrect' | 'solved';\n\nfunction isLessonCompleted(states: BlockState[]) {\n  return states.every((state) => state === 'solved');\n}", 'features/progress/model.ts'),
                $this->important('Состояние должно быть атомарным', 'Не стоит считать прогресс только на уровне урока. Блок — более точная единица для аналитики и восстановления состояния.'),
                $this->quote('Пользователь должен понимать не только итог, но и путь до него.', 'Методические заметки'),
                $this->warning('Не смешивай просмотр и успешное решение', 'Теоретический блок можно считать открытым, но практический блок должен требовать проверки ответа.'),
                $this->link('Документация PostgreSQL по JSON', 'https://www.postgresql.org/docs/current/datatype-json.html', 'Подходит для хранения гибкого содержимого блока.'),
                $this->divider('dashed'),
            ],
            [
                $this->heading('Безопасный рендер пользовательского контента', 1),
                $this->paragraph('Публикации могут создаваться пользователями, поэтому renderer должен доверять только известным типам блоков и валидированной структуре content.'),
                $this->markdown("### Минимальное правило\n\nНеизвестный тип блока лучше не рендерить, чем пытаться вывести его как обычный текст."),
                $this->image('/images/publications/security-renderer.webp', 'Безопасный renderer блоков', 'Демонстрационная картинка для блока image.'),
                $this->video('https://vimeo.com/123456789', 'Короткое видео о безопасности интерфейса', 'vimeo'),
                $this->code('tsx', "export function PublicationBlockRenderer({ block }: Props) {\n  switch (block.type) {\n    case 'paragraph':\n      return <p>{block.content.text}</p>;\n    case 'code':\n      return <pre>{block.content.code}</pre>;\n    default:\n      return null;\n  }\n}", 'components/publications/publication-block-renderer.tsx'),
                $this->important('Whitelist вместо доверия', 'Renderer должен явно поддерживать только разрешённые типы блоков: paragraph, code, image, quote и другие.'),
                $this->quote('Чем гибче контент, тем строже должна быть его проверка.', 'Заметка по безопасности'),
                $this->warning('Опасность XSS', 'Markdown, HTML и ссылки требуют отдельной проверки. Особенно внимательно обрабатывай href, src и пользовательский markdown.'),
                $this->link('OWASP: Cross Site Scripting', 'https://owasp.org/www-community/attacks/xss/', 'Краткое описание риска XSS при выводе пользовательского контента.'),
                $this->divider('gradient'),
            ],
        ];
    }

    private function compactBlocks(string $title, int $index): array
    {
        return [
            $this->heading($title, 2),
            $this->paragraph('Короткий демонстрационный материал для проверки списка публикаций, страницы просмотра и разных статусов записей.'),
            $this->link('Открыть раздел публикаций', '/publications', 'Внутренняя ссылка для проверки блока link.'),
        ];
    }

    private function heading(string $text, int $level = 2): array
    {
        return [
            'type' => PublicationBlockType::Heading,
            'content' => [
                'text' => $text,
                'level' => $level,
            ],
        ];
    }

    private function paragraph(string $text): array
    {
        return [
            'type' => PublicationBlockType::Paragraph,
            'content' => [
                'text' => $text,
            ],
        ];
    }

    private function markdown(string $text): array
    {
        return [
            'type' => PublicationBlockType::Markdown,
            'content' => [
                'text' => $text,
                'markdown' => $text,
            ],
        ];
    }

    private function image(string $src, string $alt, ?string $caption = null): array
    {
        return [
            'type' => PublicationBlockType::Image,
            'content' => [
                'src' => $src,
                'url' => $src,
                'alt' => $alt,
                'caption' => $caption,
            ],
        ];
    }

    private function video(string $url, string $title, string $provider = 'youtube'): array
    {
        return [
            'type' => PublicationBlockType::Video,
            'content' => [
                'url' => $url,
                'provider' => $provider,
                'title' => $title,
            ],
        ];
    }

    private function code(string $language, string $code, ?string $filename = null): array
    {
        return [
            'type' => PublicationBlockType::Code,
            'content' => [
                'language' => $language,
                'code' => $code,
                'filename' => $filename,
            ],
        ];
    }

    private function important(string $title, string $text): array
    {
        return [
            'type' => PublicationBlockType::Important,
            'content' => [
                'title' => $title,
                'text' => $text,
            ],
        ];
    }

    private function quote(string $text, ?string $author = null): array
    {
        return [
            'type' => PublicationBlockType::Quote,
            'content' => [
                'text' => $text,
                'author' => $author,
            ],
        ];
    }

    private function warning(string $title, string $text): array
    {
        return [
            'type' => PublicationBlockType::Warning,
            'content' => [
                'title' => $title,
                'text' => $text,
            ],
        ];
    }

    private function link(string $title, string $url, ?string $description = null): array
    {
        return [
            'type' => PublicationBlockType::Link,
            'content' => [
                'title' => $title,
                'url' => $url,
                'description' => $description,
            ],
        ];
    }

    private function divider(string $style = 'solid'): array
    {
        return [
            'type' => PublicationBlockType::Divider,
            'content' => [
                'style' => $style,
            ],
        ];
    }
}
