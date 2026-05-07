"use client"

import { Bell, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function AppHeader() {
    return (
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/70">
            <div className="flex items-center gap-3">
                <SidebarTrigger />

                <Separator orientation="vertical" className="h-5" />

                <span className="text-sm text-muted-foreground">
                    Информационное сообщество и LMS
                </span>
            </div>

            <div className="flex items-center gap-1">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Поиск"
                >
                    <Search className="size-4" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Уведомления"
                >
                    <Bell className="size-4" />
                </Button>
            </div>
        </header>
    )
}