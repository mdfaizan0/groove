import { useEffect } from "react";
import { useState } from "react";
import { AuthContext } from "./AuthContext";
import { supabase } from "@/lib/supabase";

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [session, setSession] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
        })

        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session)
                setUser(session?.user ?? null)
            }
        )

        return () => {
            listener.subscription.unsubscribe()
        }
    }, [])

    return (
        <AuthContext.Provider value={{ user, session, loading }}>
            {children}
        </AuthContext.Provider>
    )
}