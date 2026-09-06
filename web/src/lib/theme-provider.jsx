import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(undefined);

export function ThemeProvider({
	children,
	defaultTheme = "light",
	storageKey = "news-app-theme",
}) {
	const [theme, setTheme] = useState(
		() => localStorage.getItem(storageKey) || defaultTheme,
	);

	useEffect(() => {
		const root = document.documentElement;
		root.classList.remove("light", "dark");
		root.classList.add(theme);
	}, [theme]);

	function updateTheme(newTheme) {
		localStorage.setItem(storageKey, newTheme);
		setTheme(newTheme);
	}

	return (
		<ThemeContext.Provider value={{ theme, setTheme: updateTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}
