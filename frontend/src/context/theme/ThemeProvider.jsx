import { useEffect, useState } from "react"
import { ThemeContext } from "./ThemeContext"

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => localStorage.getItem("groove-theme") || "dark")
    useEffect(() => {
        const root = document.documentElement
        if (theme === "dark") {
            root.classList.add("dark")
            root.classList.remove("light")
        } else {
            root.classList.add("light")
            root.classList.remove("dark")
        }
        localStorage.setItem("groove-theme", theme)
    }, [theme])

    function toggleTheme() {
        setTheme(theme === "dark" ? "light" : "dark")
    }
    
    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeProvider