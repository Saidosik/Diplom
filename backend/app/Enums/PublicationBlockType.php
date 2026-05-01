<?php

namespace App\Enums;

enum PublicationBlockType: string
{
    case Heading = 'heading';
    case Paragraph = 'paragraph';
    case Markdown = 'markdown';
    case Image = 'image';
    case Video = 'video';
    case Code = 'code';
    case Important = 'important';
    case Quote = 'quote';
    case Warning = 'warning';
    case Link = 'link';
    case Divider = 'divider';

    public function label(): string
    {
        return match ($this) {
            self::Heading => 'Заголовок',
            self::Paragraph => 'Текст',
            self::Markdown => 'Markdown',
            self::Image => 'Изображение',
            self::Important => 'Важно',
            self::Video => 'Видео',
            self::Code => 'Код',
            self::Quote => 'Цитата',
            self::Warning => 'Предупреждение',
            self::Link => 'Ссылка',
            self::Divider => 'Разделитель',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
