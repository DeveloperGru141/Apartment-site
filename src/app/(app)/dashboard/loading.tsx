import Navbar from "@/components/navbar"
import DashboardSkeleton from "@/components/dashboard-skeleton"

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="min-h-[85vh] bg-white px-6 py-16 md:px-16 lg:px-24">
        <DashboardSkeleton />
      </main>
    </div>
  )
}
