"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { navigationGroups } from "@/config/navigation"
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

function isActivePath(pathname: string, href: string) {
    return pathname === href || pathname.startsWith(`${href}/`)
}

export function NavMain() {
    const pathname = usePathname()

    return (
        <>
            {navigationGroups.map((group) => (
                <SidebarGroup key={group.title}>
                    <SidebarGroupLabel>{group.title}</SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu>
                            {group.items.map((item) => {
                                const Icon = item.icon
                                const isActive = isActivePath(pathname, item.href)

                                return (
                                    <SidebarMenuItem key={item.href}>
                                        {item.disabled ? (
                                            <SidebarMenuButton
                                                disabled
                                                tooltip={item.title}
                                                className="opacity-60"
                                            >
                                                <Icon />
                                                <span>{item.title}</span>
                                            </SidebarMenuButton>
                                        ) : (
                                            <SidebarMenuButton
                                                asChild
                                                isActive={isActive}
                                                tooltip={item.title}
                                            >
                                                <Link href={item.href}>
                                                    <Icon />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        )}

                                        {item.badge && (
                                            <SidebarMenuBadge>
                                                {item.badge}
                                            </SidebarMenuBadge>
                                        )}
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            ))}
        </>
    )
}