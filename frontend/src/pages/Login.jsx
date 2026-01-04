import { signIn } from "@/auth/authActions"
import { useAuth } from "@/context/auth/useAuth"
import { useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Music2, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

function Login() {
  const [userData, setUserData] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { user: userLoggedIn } = useAuth()

  if (userLoggedIn) {
    return <Navigate to="/dashboard" replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!userData.email.trim() || !userData.password.trim()) {
      return
    }

    setLoading(true)
    try {
      await signIn(userData.email, userData.password)
      navigate("/dashboard")
      toast.success("Login successful")
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#0a0a0f] overflow-hidden">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-8 left-8 z-20 text-white/50 hover:text-white hover:bg-white/10 rounded-full h-12 w-12"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={24} />
      </Button>

      {/* Dynamic Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-pulse delay-700" />

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="backdrop-blur-xl bg-card/30 border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20 transform rotate-12">
              <Music2 className="text-primary-foreground -rotate-12" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h1>
            <p className="text-muted-foreground mt-2">Log in to your Groove account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground ml-1">Email</label>
              <Input
                placeholder="name@example.com"
                className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50 h-12 focus:ring-primary/50"
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground ml-1">Password</label>
              <Input
                placeholder="••••••••"
                className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50 h-12 focus:ring-primary/50"
                type="password"
                value={userData.password}
                onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                required
              />
            </div>
            <Button
              className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging In..." : "Log In"}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link to="/signup" className="text-primary font-semibold hover:underline underline-offset-4 transition-all">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login