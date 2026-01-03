import { signOut } from "@/auth/authActions"
import { useAuth } from "@/context/auth/useAuth"
import { Compass, Home, LayoutDashboard, Library, ListMusic, LogOut, Podcast, Search, User2Icon, UserPlus2 } from "lucide-react"
import { NavLink, useNavigate } from "react-router-dom"

import React from 'react'

// eslint-disable-next-line no-unused-vars
const SidebarItem = ({ path, icon: Icon, label }) => {
    return (
        <NavLink
            to={path}
            className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group
            ${isActive ?
                    `bg-primary/10 text-primary shadow-sm ring-1 ring-primary/10`
                    : `text-muted-foreground hover:bg-muted hover:text-foreground`}
            `}
        >
            <Icon />
            <span className="font-medium">{label}</span>
        </NavLink>
    )
}

const Sidebar = () => {
    const { user } = useAuth()
    const navigate = useNavigate()

    const navItems = [
        { icon: Home, label: "Home", path: "/" },
        { icon: Compass, label: "Explore", path: "/explore" },
        { icon: Search, label: "Search", path: "/search" },
        { icon: Podcast, label: "Podcast", path: "/podcasts" },
    ]

    async function handleLogout() {
        try {
            await signOut()
            navigate("/login")
        } catch (error) {
            console.error("Sign Out Error:", error)
        }
    }

    return (
        <div className="flex flex-col w-64 h-full border-r border-sidebar-border/50 p-4 gap-3 transition-all duration-300 select-none">

            {/* Logo */}
            <div className="flex items-center gap-3 px-4 py-8 mb-4">
                <div className="w-10 h-10 flex items-center justify-center">
                    <img src="/favicon/android-chrome-192x192.png" alt="Groove Logo" className="w-full h-full object-contain" />
                </div>
                <h1 className="text-2xl font-black tracking-tighter bg-linear-to-r from-white to-white/60 bg-clip-text text-transparent">
                    Groove
                </h1>
            </div>

            {/* Main Nav */}
            <div className="flex flex-col gap-2 mb-8">
                {navItems.map(item => (
                    <SidebarItem key={item.path} {...item} />
                ))}
            </div>

            {/* Your Stuff */}
            <div className="flex flex-col gap-2 flex-1 overflow-y-auto custom-scrollbar">
                <h2 className="px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-2">
                    {user ? "Your Stuff" : "Let's Dive In!"}
                </h2>
                {user ? (
                    <div className="flex flex-col gap-2">
                        <SidebarItem icon={Library} label="Library" path="/library" />
                        <SidebarItem icon={LayoutDashboard} label="Dashboard" path="/dashboard" />
                        <SidebarItem icon={ListMusic} label="My Playlists" path="/playlists" />
                    </div>
                ) : (
                    <div className="flex flex-col gap-2 cursor-pointer">
                        <SidebarItem icon={UserPlus2} label="Sign Up" path="/signup" />
                        <SidebarItem icon={User2Icon} label="Login" path="/login" />
                    </div>
                )}
            </div>

            {/* User Profile */}
            {user && (
                <div className="mt-auto pt-6 border-t border-sidebar-border/50">
                    <div className="flex items-center gap-3 px-4 py-2 mb-4 bg-muted/30 rounded-2xl hover:bg-primary/10 transition-colors duration-300">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                            {user.user_metadata?.name?.[0]?.toUpperCase() ?? "U"}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-semibold truncate">{user.user_metadata?.name ?? "User"}</span>
                            <span className="text-[10px] text-primary bg-primary/10 px-2 py-1 rounded-full truncate">Premium</span>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-4 w-full px-4 py-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-300 group cursor-pointer"
                    >
                        <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            )}
        </div>
    )
}

export default Sidebar