import Sidebar from "@/components/Sidebar"
import MiniPlayer from "@/components/MiniPlayer"
import { Outlet } from "react-router-dom"

const MainLayout = () => {
    return (
        <div className="flex bg-background min-h-screen relative font-sans">
            {/* Pinned Sidebar */}
            <aside className="sticky top-0 h-screen hidden md:flex flex-col shrink-0">
                <Sidebar />
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen min-w-0">
                <main className="flex-1 p-4 md:p-8">
                    <div className="container max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>

                {/* Sticky Player */}
                <div className="sticky bottom-0 z-50 w-full shrink-0">
                    <MiniPlayer />
                </div>
            </div>
        </div>
    )
}

export default MainLayout