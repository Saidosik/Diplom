"use client"

import Link from "next/link"
import { GraduationCap } from "lucide-react"

import type { User } from "@/features/auth/types"
import { NavMain } from "@/components/layout/nav-main"
import { SidebarUser } from "@/components/layout/sidebar-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarSeparator,
} from "@/components/ui/sidebar"

type AppSidebarProps = {
    user: User
}

export function AppSidebar({ user }: AppSidebarProps) {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className="p-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            size="lg"
                            tooltip="DevCommunity"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Link href="/profile">
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <GraduationCap className="size-4" />
                                </div>

                                <div className="grid min-w-0 flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                                    <span className="truncate font-semibold">
                                        DevCommunity
                                    </span>
                                    <span className="truncate text-xs text-sidebar-foreground/60">
                                        Community + LMS
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarSeparator />

            <SidebarContent>
                <NavMain />
            </SidebarContent>

            <SidebarSeparator />

            <SidebarFooter className="p-2">
                <SidebarUser user={user} />
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    )
}