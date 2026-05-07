import { requireUser } from "@/features/auth/server"
import { ProfilePageContent } from "@/features/profile/components/profile-page-content"

export default async function ProfilePage() {
    const user = await requireUser()

    return <ProfilePageContent user={user} />
}