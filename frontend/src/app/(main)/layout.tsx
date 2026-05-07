import { cookies } from "next/headers"

import { AppHeader } from "@/components/layout/app-header"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { requireUser } from "@/features/auth/server"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"

export default async function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await requireUser()

    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false"

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar user={user} />

            <SidebarInset>
                <AppHeader />

                <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}