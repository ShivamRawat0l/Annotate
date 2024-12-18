import React, { useContext, useState } from "react"
import type { ThemeColors } from "./colors"

type ThemeContextType = {
	theme: keyof ThemeColors,
	setTheme: (theme: keyof ThemeColors) => void
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {

	const [theme, setThemeColor] = useState<keyof ThemeColors>("dark")

	const setTheme = (theme: keyof ThemeColors) => {
		setThemeColor(theme)
	}

	return <ThemeContext.Provider value={{
		theme, setTheme
	}}>
		{children}
	</ThemeContext.Provider>
}

export const useTheme = () => {
	const theme = useContext(ThemeContext)
	if (theme === undefined) {
		throw new Error("useTheme context not found")
	}
	return theme;
}
