import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./lib/theme-provider";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<ThemeProvider defaultTheme="light" storageKey="news-app-theme">
			<BrowserRouter>
				<App /> 
			</BrowserRouter>
		</ThemeProvider>
	</StrictMode>,
);
