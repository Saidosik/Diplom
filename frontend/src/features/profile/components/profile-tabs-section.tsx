import {
    Bookmark,
    BookOpen,
    CircleHelp,
    GraduationCap,
    MessageSquare,
    Newspaper,
    Settings,
} from "lucide-react"

import type { User } from "@/features/auth/types"
import { ProfileAccountCard } from "@/features/profile/components/profile-account-card"
import { ProfileCommunityCard } from "@/features/profile/components/profile-community-card"
import { ProfileLearningCard } from "@/features/profile/components/profile-learning-card"
import { ProfileSecurityCard } from "@/features/profile/components/profile-security-card"
import { ProfileStatGrid } from "@/features/profile/components/profile-stat-grid"
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

type ProfileTabsSectionProps = {
    user: User
}

export function ProfileTabsSection({ user }: ProfileTabsSectionProps) {
    return (
        <Tabs defaultValue="overview" className="space-y-6">
            <TabsList variant="line">
                <TabsTrigger value="overview">
                    Обзор
                </TabsTrigger>

                <TabsTrigger value="activity">
                    Активность
                </TabsTrigger>

                <TabsTrigger value="learning">
                    Обучение
                </TabsTrigger>

                <TabsTrigger value="saved">
                    Сохранённое
                </TabsTrigger>

                <TabsTrigger value="settings">
                    Настройки
                </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
                <ProfileStatGrid />

                <div className="grid gap-6 lg:grid-cols-12">
                    <aside className="space-y-4 lg:col-span-4">
                        <ProfileAccountCard user={user} />
                        <ProfileSecurityCard user={user} />
                    </aside>

                    <section className="min-w-0 space-y-4 lg:col-span-8">
                        <ProfileLearningCard />
                        <ProfileCommunityCard />
                    </section>
                </div>
            </TabsContent>

            <TabsContent value="activity">
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>
                            Активность
                        </CardTitle>

                        <CardDescription>
                            Здесь будет история действий пользователя в сообществе.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            <ProfilePlaceholder
                                icon={Newspaper}
                                title="Публикации"
                                description="Здесь появятся опубликованные материалы пользователя."
                            />

                            <ProfilePlaceholder
                                icon={CircleHelp}
                                title="Вопросы"
                                description="Здесь появятся вопросы, заданные пользователем."
                            />

                            <ProfilePlaceholder
                                icon={MessageSquare}
                                title="Ответы"
                                description="Здесь появятся ответы на вопросы других участников."
                            />

                            <ProfilePlaceholder
                                icon={BookOpen}
                                title="Комментарии"
                                description="Здесь появятся комментарии к публикациям и обсуждениям."
                            />
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="learning">
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>
                            Обучение
                        </CardTitle>

                        <CardDescription>
                            Здесь будет подробный прогресс по курсам, урокам и заданиям.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <ProfilePlaceholder
                                icon={GraduationCap}
                                title="Курсы"
                                description="Место под список начатых и завершённых курсов."
                            />

                            <ProfilePlaceholder
                                icon={BookOpen}
                                title="Уроки"
                                description="Место под пройденные уроки и текущие модули."
                            />

                            <ProfilePlaceholder
                                icon={CircleHelp}
                                title="Задачи"
                                description="Место под тесты и практические задания по коду."
                            />
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="saved">
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>
                            Сохранённое
                        </CardTitle>

                        <CardDescription>
                            Место под сохранённые публикации, вопросы и курсы.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <ProfilePlaceholder
                                icon={Newspaper}
                                title="Сохранённые публикации"
                                description="Здесь будут материалы, которые пользователь сохранил для чтения."
                            />

                            <ProfilePlaceholder
                                icon={CircleHelp}
                                title="Сохранённые вопросы"
                                description="Здесь будут вопросы, которые пользователь добавил в сохранённое."
                            />

                            <ProfilePlaceholder
                                icon={GraduationCap}
                                title="Сохранённые курсы"
                                description="Здесь будут курсы, добавленные в сохранённое."
                            />
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="settings">
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>
                            Настройки профиля
                        </CardTitle>

                        <CardDescription>
                            Здесь позже появится редактирование имени, аватара и параметров аккаунта.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <ProfilePlaceholder
                            icon={Settings}
                            title="Настройки пока недоступны"
                            description="Этот раздел будет реализован после завершения основного auth flow и профиля."
                        />
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
}

function ProfilePlaceholder({
    icon: Icon,
    title,
    description,
}: {
    icon: React.ElementType
    title: string
    description: string
}) {
    return (
        <Empty className="min-h-56 border">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <Icon className="size-5" />
                </EmptyMedia>

                <EmptyTitle>
                    {title}
                </EmptyTitle>

                <EmptyDescription>
                    {description}
                </EmptyDescription>
            </EmptyHeader>

            <EmptyContent>
                <p className="text-xs text-muted-foreground">
                    Данные появятся после подключения соответствующего backend-раздела.
                </p>
            </EmptyContent>
        </Empty>
    )
}