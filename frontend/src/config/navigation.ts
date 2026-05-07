import type { LucideIcon } from "lucide-react"
import {
    BookOpen,
    CircleHelp,
    GraduationCap,
    Newspaper,
    Settings,
    Shield,
    Tags,
    User,
} from "lucide-react"

export type NavigationItem = {
    title: string
    href: string
    icon: LucideIcon
    badge?: string
    disabled?: boolean
    roles?: Array<"user" | "admin" | "moderator">
}

export type NavigationGroup = {
    title: string
    items: NavigationItem[]
}

export const navigationGroups: NavigationGroup[] = [
    {
        title: "Главное",
        items: [
            {
                title: "Профиль",
                href: "/profile",
                icon: User,
            },
        ],
    },
    {
        title: "Сообщество",
        items: [
            {
                title: "Публикации",
                href: "/publications",
                icon: Newspaper,
                badge: "скоро",
                disabled: true,
            },
            {
                title: "Вопросы",
                href: "/questions",
                icon: CircleHelp,
                badge: "скоро",
                disabled: true,
            },
            {
                title: "Теги",
                href: "/tags",
                icon: Tags,
                badge: "скоро",
                disabled: true,
            },
        ],
    },
    {
        title: "Обучение",
        items: [
            {
                title: "Курсы",
                href: "/courses",
                icon: GraduationCap,
                badge: "скоро",
                disabled: true,
            },
            {
                title: "Мой прогресс",
                href: "/learning/progress",
                icon: BookOpen,
                badge: "скоро",
                disabled: true,
            },
        ],
    },
    {
        title: "Система",
        items: [
            {
                title: "Настройки",
                href: "/settings",
                icon: Settings,
                badge: "скоро",
                disabled: true,
            },
            {
                title: "Админ-панель",
                href: "/admin",
                icon: Shield,
                badge: "admin",
                disabled: true,
                roles: ["admin"],
            },
        ],
    },
]

export function getNavigationItemByPathname(pathname: string) {
    return navigationGroups
        .flatMap((group) => group.items)
        .find((item) => {
            return pathname === item.href || pathname.startsWith(`${item.href}/`)
        })
}