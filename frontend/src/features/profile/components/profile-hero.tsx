import {
    CalendarDays,
    Pencil,
} from "lucide-react"

import type { User } from "@/features/auth/types"
import { UserAvatar } from "@/features/users/components/user-avatar"
import {
    formatProfileDate,
    getUserRoleLabel,
} from "@/features/users/lib/user-display"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type ProfileHeroProps = {
    user: User
}

export function ProfileHero({ user }: ProfileHeroProps) {
    return (
        <Card className="relative overflow-hidden border bg-card shadow-sm">
            <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute left-20 top-0 h-28 w-56 rounded-full bg-primary/5 blur-2xl" />

            <CardContent className="relative 8">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                        <UserAvatar
                            user={user}
                            size="xl"
                            className="border border-border shadow-sm"
                        />

                        <div className="min-w-0 space-y-3">
                            <div>
                                <h2 className="truncate text-3xl font-semibold tracking-tight">
                                    {user.name}
                                </h2>

                                <p className="truncate text-sm text-muted-foreground">
                                    {user.email}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="secondary">
                                    {getUserRoleLabel(user.role)}
                                </Badge>

                                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <CalendarDays className="size-4" />
                                    Зарегистрирован {formatProfileDate(user.created_at)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <Button variant="outline" disabled>
                        <Pencil className="size-4" />
                        Редактировать профиль
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}