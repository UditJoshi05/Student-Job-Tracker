import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "@/components/dashboard/overview"
import { RecentApplications } from "@/components/dashboard/recent-applications"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"

export default async function DashboardPage() {
  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user.firstName}!</p>
      </div>

      <DashboardStats userId={user.id} />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="recent">Recent Applications</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Overview userId={user.id} />
        </TabsContent>
        <TabsContent value="recent" className="space-y-4">
          <RecentApplications userId={user.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
