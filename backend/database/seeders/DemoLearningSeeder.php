<?php

namespace Database\Seeders;

use App\Models\Answer;
use App\Models\AnswerOption;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\LessonBlock;
use App\Models\LessonBlockContent;
use App\Models\Module;
use App\Models\Question;
use App\Models\Test;
use App\Models\TestAttempt;
use App\Models\User;
use App\Models\UserAnswer;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DemoLearningSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement(
            'TRUNCATE TABLE user_answers, test_attempts, answers, answer_options, questions, tests, lesson_block_contents, lesson_blocks, lessons, modules, courses RESTART IDENTITY CASCADE'
        );

        $users = $this->seedUsers();

        $courseData = [
            [
                'name' => 'PHP и Laravel: основа backend-разработки',
                'slug' => 'php-laravel-backend-basics',
                'description' => 'Курс для проверки каталога, структуры курса, теории и тестов по PHP и Laravel.',
                'price' => 0,
                'modules' => [
                    [
                        'name' => 'Основы PHP',
                        'lessons' => [
                            [
                                'name' => 'Переменные и типы данных',
                                'blocks' => [
                                    [
                                        'type' => 'theory',
                                        'name' => 'Что такое переменная',
                                        'contents' => [
                                            ['heading', ['text' => 'Переменные в PHP']],
                                            ['text', ['text' => 'Переменная хранит значение и начинается со знака доллара. Имя переменной должно быть понятным и отражать смысл данных.']],
                                            ['example', ['language' => 'php', 'code' => '$name = "Said";\n$age = 18;']],
                                            ['important', ['text' => 'Не смешивай хранение данных и вывод. Сначала подготовь данные, затем передавай их в представление.']],
                                        ],
                                    ],
                                    [
                                        'type' => 'test',
                                        'name' => 'Проверка по переменным',
                                        'test' => [
                                            'name' => 'Мини-тест: переменные PHP',
                                            'questions' => [
                                                [
                                                    'type' => 'single',
                                                    'text' => 'С какого символа начинается переменная в PHP?',
                                                    'options' => ['#', '$', '@', '&'],
                                                    'correct' => [1],
                                                ],
                                                [
                                                    'type' => 'multiple',
                                                    'text' => 'Какие имена переменных являются понятными?',
                                                    'options' => ['$userName', '$a', '$coursePrice', '$x1'],
                                                    'correct' => [0, 2],
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                            [
                                'name' => 'Условия и массивы',
                                'blocks' => [
                                    [
                                        'type' => 'theory',
                                        'name' => 'Условные конструкции',
                                        'contents' => [
                                            ['heading', ['text' => 'if, else и массивы']],
                                            ['text', ['text' => 'Условие позволяет выполнить разные ветки кода в зависимости от результата проверки. Массив хранит набор связанных значений.']],
                                            ['example', ['language' => 'php', 'code' => 'if ($score >= 80) {\n    $status = "passed";\n} else {\n    $status = "failed";\n}']],
                                            ['clue', ['text' => 'В учебной платформе условия удобно применять при проверке результата теста.']],
                                        ],
                                    ],
                                    [
                                        'type' => 'test',
                                        'name' => 'Проверка по условиям',
                                        'test' => [
                                            'name' => 'Мини-тест: условия',
                                            'questions' => [
                                                [
                                                    'type' => 'single',
                                                    'text' => 'Какая конструкция используется для ветвления?',
                                                    'options' => ['foreach', 'if', 'echo', 'return'],
                                                    'correct' => [1],
                                                ],
                                                [
                                                    'type' => 'multiple',
                                                    'text' => 'Что может хранить массив?',
                                                    'options' => ['Строки', 'Числа', 'Объекты', 'Только один символ'],
                                                    'correct' => [0, 1, 2],
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                    [
                        'name' => 'Laravel API',
                        'lessons' => [
                            [
                                'name' => 'Маршруты и контроллеры',
                                'blocks' => [
                                    [
                                        'type' => 'theory',
                                        'name' => 'Resource controller',
                                        'contents' => [
                                            ['heading', ['text' => 'Маршруты API в Laravel']],
                                            ['text', ['text' => 'Маршрут связывает HTTP-запрос с методом контроллера. Resource controller помогает держать CRUD-логику в предсказуемой структуре.']],
                                            ['example', ['language' => 'php', 'code' => 'Route::apiResource("courses", CourseController::class);']],
                                            ['warning', ['text' => 'Не отдавай скрытые курсы в публичном каталоге. Фильтруй записи по статусу.']],
                                        ],
                                    ],
                                    [
                                        'type' => 'test',
                                        'name' => 'Проверка по маршрутам',
                                        'test' => [
                                            'name' => 'Мини-тест: Laravel API',
                                            'questions' => [
                                                [
                                                    'type' => 'single',
                                                    'text' => 'Какой метод обычно отвечает за список ресурсов?',
                                                    'options' => ['show', 'index', 'store', 'destroy'],
                                                    'correct' => [1],
                                                ],
                                                [
                                                    'type' => 'multiple',
                                                    'text' => 'Что стоит проверять перед изменением курса?',
                                                    'options' => ['Авторство пользователя', 'Права доступа', 'Случайный цвет кнопки', 'Валидность входных данных'],
                                                    'correct' => [0, 1, 3],
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                            [
                                'name' => 'FormRequest и Resource',
                                'blocks' => [
                                    [
                                        'type' => 'theory',
                                        'name' => 'Валидация и ответ API',
                                        'contents' => [
                                            ['heading', ['text' => 'FormRequest и JsonResource']],
                                            ['text', ['text' => 'FormRequest отвечает за авторизацию и проверку входных данных. Resource формирует безопасный и стабильный формат ответа.']],
                                            ['important', ['text' => 'Resource не должен случайно раскрывать служебные поля, например role или password.']],
                                            ['example', ['language' => 'php', 'code' => 'return new CourseResource($course);']],
                                        ],
                                    ],
                                    [
                                        'type' => 'test',
                                        'name' => 'Проверка по FormRequest',
                                        'test' => [
                                            'name' => 'Мини-тест: валидация',
                                            'questions' => [
                                                [
                                                    'type' => 'single',
                                                    'text' => 'Где удобнее описывать правила проверки запроса?',
                                                    'options' => ['В миграции', 'В FormRequest', 'В CSS', 'В README'],
                                                    'correct' => [1],
                                                ],
                                                [
                                                    'type' => 'multiple',
                                                    'text' => 'Какие задачи решает Resource?',
                                                    'options' => ['Формирует JSON', 'Скрывает лишние поля', 'Создает таблицу в БД', 'Может подгружать вложенные ресурсы'],
                                                    'correct' => [0, 1, 3],
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
            [
                'name' => 'Next.js: интерфейс учебной платформы',
                'slug' => 'nextjs-learning-platform-ui',
                'description' => 'Курс для проверки фронтенда: страницы, состояние авторизации, запросы к Laravel API.',
                'price' => 1500,
                'modules' => [
                    [
                        'name' => 'Основы Next.js',
                        'lessons' => [
                            [
                                'name' => 'Страницы и компоненты',
                                'blocks' => [
                                    [
                                        'type' => 'theory',
                                        'name' => 'Компонентный подход',
                                        'contents' => [
                                            ['heading', ['text' => 'Компоненты интерфейса']],
                                            ['text', ['text' => 'Компонент — самостоятельная часть интерфейса. Его удобно переиспользовать в разных страницах приложения.']],
                                            ['example', ['language' => 'tsx', 'code' => 'export function CourseCard() {\n  return <article>Курс</article>;\n}']],
                                        ],
                                    ],
                                    [
                                        'type' => 'test',
                                        'name' => 'Проверка по компонентам',
                                        'test' => [
                                            'name' => 'Мини-тест: компоненты',
                                            'questions' => [
                                                [
                                                    'type' => 'single',
                                                    'text' => 'Для чего нужен компонент?',
                                                    'options' => ['Для переиспользования части интерфейса', 'Для создания миграций', 'Для настройки PostgreSQL', 'Для хеширования пароля'],
                                                    'correct' => [0],
                                                ],
                                                [
                                                    'type' => 'multiple',
                                                    'text' => 'Что может содержать компонент?',
                                                    'options' => ['Разметку', 'Обработчики событий', 'Стили', 'SQL-миграцию'],
                                                    'correct' => [0, 1, 2],
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                            [
                                'name' => 'Клиентские запросы',
                                'blocks' => [
                                    [
                                        'type' => 'theory',
                                        'name' => 'Axios и состояние загрузки',
                                        'contents' => [
                                            ['heading', ['text' => 'Запросы из интерфейса']],
                                            ['text', ['text' => 'При запросе к API интерфейс должен учитывать три состояния: загрузка, успешный ответ и ошибка.']],
                                            ['example', ['language' => 'ts', 'code' => 'const response = await axios.get("/api/courses");']],
                                            ['danger', ['text' => 'Не храни секреты backend-приложения в переменных NEXT_PUBLIC_*. Они попадут в браузер.']],
                                        ],
                                    ],
                                    [
                                        'type' => 'test',
                                        'name' => 'Проверка по запросам',
                                        'test' => [
                                            'name' => 'Мини-тест: запросы',
                                            'questions' => [
                                                [
                                                    'type' => 'single',
                                                    'text' => 'Какое состояние нужно показать, пока запрос еще выполняется?',
                                                    'options' => ['loading', 'deleted', 'hidden', 'banned'],
                                                    'correct' => [0],
                                                ],
                                                [
                                                    'type' => 'multiple',
                                                    'text' => 'Какие состояния полезно обрабатывать при запросе?',
                                                    'options' => ['Загрузка', 'Успех', 'Ошибка', 'Случайный редирект'],
                                                    'correct' => [0, 1, 2],
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                    [
                        'name' => 'Авторизация во фронтенде',
                        'lessons' => [
                            [
                                'name' => 'Login flow',
                                'blocks' => [
                                    [
                                        'type' => 'theory',
                                        'name' => 'Вход пользователя',
                                        'contents' => [
                                            ['heading', ['text' => 'Поток входа']],
                                            ['text', ['text' => 'Форма отправляет почту и пароль, backend проверяет данные и возвращает результат авторизации. После входа интерфейс должен обновить состояние пользователя.']],
                                            ['important', ['text' => 'После успешного входа удобно перенаправлять пользователя в раздел его курсов.']],
                                        ],
                                    ],
                                    [
                                        'type' => 'test',
                                        'name' => 'Проверка по auth flow',
                                        'test' => [
                                            'name' => 'Мини-тест: auth flow',
                                            'questions' => [
                                                [
                                                    'type' => 'single',
                                                    'text' => 'Что должен сделать фронтенд после успешного входа?',
                                                    'options' => ['Обновить состояние пользователя', 'Удалить все курсы', 'Создать миграцию', 'Очистить таблицу users'],
                                                    'correct' => [0],
                                                ],
                                                [
                                                    'type' => 'multiple',
                                                    'text' => 'Какие данные обычно вводят при входе?',
                                                    'options' => ['Почта', 'Пароль', 'Название курса', 'sort_order урока'],
                                                    'correct' => [0, 1],
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                            [
                                'name' => 'Защищенные страницы',
                                'blocks' => [
                                    [
                                        'type' => 'theory',
                                        'name' => 'Проверка пользователя',
                                        'contents' => [
                                            ['heading', ['text' => 'Защита разделов приложения']],
                                            ['text', ['text' => 'Перед показом личного раздела нужно понять, авторизован ли пользователь. Если нет — его следует направить на страницу входа.']],
                                            ['clue', ['text' => 'Для проверки можно использовать endpoint /me и состояние auth на клиенте.']],
                                        ],
                                    ],
                                    [
                                        'type' => 'test',
                                        'name' => 'Проверка по защищенным страницам',
                                        'test' => [
                                            'name' => 'Мини-тест: защищенные страницы',
                                            'questions' => [
                                                [
                                                    'type' => 'single',
                                                    'text' => 'Куда логично отправить гостя при попытке открыть личный раздел?',
                                                    'options' => ['На страницу входа', 'В Telescope', 'В миграции', 'В корзину'],
                                                    'correct' => [0],
                                                ],
                                                [
                                                    'type' => 'multiple',
                                                    'text' => 'Что помогает понять, кто сейчас авторизован?',
                                                    'options' => ['Запрос /me', 'Cookie/токен', 'Состояние auth', 'Название CSS-класса'],
                                                    'correct' => [0, 1, 2],
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ];

        foreach ($courseData as $courseIndex => $coursePayload) {
            $course = Course::query()->create([
                'name' => $coursePayload['name'],
                'slug' => $coursePayload['slug'],
                'description' => $coursePayload['description'],
                'status' => 'published',
                'price' => $coursePayload['price'],
                'author_id' => $users[$courseIndex]->id,
            ]);

            $this->seedCourseStructure($course, $coursePayload['modules']);
        }

        $this->seedDemoAttempts($users);
    }

    /**
     * @return array<int, User>
     */
    private function seedUsers(): array
    {
        $users = [];

        for ($i = 1; $i <= 10; $i++) {
            $users[] = User::query()->updateOrCreate(
                ['email' => "test{$i}@gmail.com"],
                [
                    'name' => "Test User {$i}",
                    'password' => Hash::make('12345678'),
                    'role' => 'user',
                    'email_verified_at' => now(),
                ],
            );
        }

        return $users;
    }

    /**
     * @param array<int, array<string, mixed>> $modules
     */
    private function seedCourseStructure(Course $course, array $modules): void
    {
        foreach ($modules as $moduleIndex => $modulePayload) {
            $module = Module::query()->create([
                'course_id' => $course->id,
                'name' => $modulePayload['name'],
                'slug' => $this->slug($course->slug, $modulePayload['name']),
                'description' => 'Учебный модуль для демонстрации структуры курса.',
                'sort_order' => $moduleIndex + 1,
                'status' => 'visible',
            ]);

            foreach ($modulePayload['lessons'] as $lessonIndex => $lessonPayload) {
                $lesson = Lesson::query()->create([
                    'module_id' => $module->id,
                    'name' => $lessonPayload['name'],
                    'slug' => $this->slug($module->slug, $lessonPayload['name']),
                    'description' => 'Урок содержит теоретический блок и проверочный тест.',
                    'sort_order' => $lessonIndex + 1,
                    'status' => 'visible',
                ]);

                foreach ($lessonPayload['blocks'] as $blockIndex => $blockPayload) {
                    $block = LessonBlock::query()->create([
                        'lesson_id' => $lesson->id,
                        'name' => $blockPayload['name'],
                        'slug' => $this->slug($lesson->slug, $blockPayload['name']),
                        'description' => $blockPayload['type'] === 'theory'
                            ? 'Теоретический материал урока.'
                            : 'Проверочный тест по материалу урока.',
                        'sort_order' => $blockIndex + 1,
                        'status' => 'visible',
                        'type' => $blockPayload['type'],
                    ]);

                    if ($blockPayload['type'] === 'theory') {
                        $this->seedTheoryContent($block, $blockPayload['contents']);
                    }

                    if ($blockPayload['type'] === 'test') {
                        $this->seedTest($block, $blockPayload['test']);
                    }
                }
            }
        }
    }

    /**
     * @param array<int, array{0:string, 1:array<string, mixed>}> $contents
     */
    private function seedTheoryContent(LessonBlock $lessonBlock, array $contents): void
    {
        foreach ($contents as $index => [$type, $content]) {
            LessonBlockContent::query()->create([
                'lesson_block_id' => $lessonBlock->id,
                'sort_order' => $index + 1,
                'status' => 'visible',
                'type' => $type,
                'content' => $content,
            ]);
        }
    }

    /**
     * @param array<string, mixed> $testPayload
     */
    private function seedTest(LessonBlock $lessonBlock, array $testPayload): void
    {
        $test = Test::query()->create([
            'lesson_block_id' => $lessonBlock->id,
            'name' => $testPayload['name'],
            'description' => 'Тест создан сидером для проверки работы вопросов, вариантов и правильных ответов.',
            'sort_order' => 1,
            'status' => 'visible',
        ]);

        foreach ($testPayload['questions'] as $questionIndex => $questionPayload) {
            $question = Question::query()->create([
                'test_id' => $test->id,
                'sort_order' => $questionIndex + 1,
                'type' => $questionPayload['type'],
                'status' => 'visible',
                'content' => [
                    'text' => $questionPayload['text'],
                ],
            ]);

            $optionIds = [];

            foreach ($questionPayload['options'] as $optionIndex => $optionText) {
                $option = AnswerOption::query()->create([
                    'question_id' => $question->id,
                    'sort_order' => $optionIndex + 1,
                    'content' => [
                        'text' => $optionText,
                    ],
                ]);

                $optionIds[$optionIndex] = $option->id;
            }

            $correctOptionIds = array_map(
                fn (int $optionIndex): int => $optionIds[$optionIndex],
                $questionPayload['correct'],
            );

            Answer::query()->create([
                'question_id' => $question->id,
                'content' => $questionPayload['type'] === 'single'
                    ? ['answer_option_id' => $correctOptionIds[0]]
                    : ['answer_option_ids' => $correctOptionIds],
            ]);
        }
    }

    /**
     * @param array<int, User> $users
     */
    private function seedDemoAttempts(array $users): void
    {
        $tests = Test::query()
            ->with(['questions.answer'])
            ->orderBy('id')
            ->limit(4)
            ->get();

        foreach ($tests as $testIndex => $test) {
            foreach (array_slice($users, 2, 4) as $userIndex => $user) {
                $attempt = TestAttempt::query()->create([
                    'test_id' => $test->id,
                    'user_id' => $user->id,
                    'status' => $userIndex % 2 === 0 ? 'passed' : 'failed',
                    'score' => $userIndex % 2 === 0 ? $test->questions->count() : max(0, $test->questions->count() - 1),
                    'max_score' => $test->questions->count(),
                    'submitted_at' => now()->subDays($testIndex + $userIndex),
                ]);

                foreach ($test->questions as $questionIndex => $question) {
                    $correctContent = $question->answer?->content ?? [];
                    $isCorrect = $userIndex % 2 === 0 || $questionIndex > 0;

                    UserAnswer::query()->create([
                        'test_attempt_id' => $attempt->id,
                        'question_id' => $question->id,
                        'status' => $isCorrect ? 'correct' : 'not_correct',
                        'content' => $isCorrect
                            ? $correctContent
                            : $this->wrongAnswerContent($question->type),
                    ]);
                }
            }
        }
    }

    private function wrongAnswerContent(string $questionType): array
    {
        return $questionType === 'single'
            ? ['answer_option_id' => 0]
            : ['answer_option_ids' => []];
    }

    private function slug(string $prefix, string $value): string
    {
        return $prefix . '-' . Str::slug($value, '-');
    }
}
