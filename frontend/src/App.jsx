import { Outlet } from "react-router-dom"
import { Toaster } from "./components/ui/sonner"

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      <Outlet />
      <Toaster position="top-right" />
    </div>
  )
}

export default App