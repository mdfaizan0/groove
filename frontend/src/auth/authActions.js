import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export async function signUp(name, email, password) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name }
            }
        })
        if (error) {
            console.error("Sign up error:", error)
            throw error
        }

        return data
    } catch (error) {
        console.error(error)
        throw new Error(error);
    }
}

export async function signIn(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })

        if (error?.code === "email_not_confirmed") {
            toast.warning("Please confirm your email")
            throw error
        }
        if (error) {
            console.error("Login in error:", error)
            throw error
        }

        return data
    } catch (error) {
        console.error(error)
        throw new Error(error);
    }
}

export async function signOut() {
    try {
        const { error } = await supabase.auth.signOut()
        toast.success("Logout successful")
        if (error) {
            console.error("Sign out error:", error)
            throw error
        }
    } catch (error) {
        console.error(error)
        throw new Error(error);
    }
}

export function getToken() {
    const token = JSON.parse(localStorage.getItem("sb-xionovfhalhfyfhygtdc-auth-token"))
    return token.access_token
}