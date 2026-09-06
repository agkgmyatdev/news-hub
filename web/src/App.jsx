import { Routes, Route } from "react-router";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Bookmarks from "./pages/Bookmarks";
import ArticleDetail from "./pages/ArticleDetail";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
	return (
		<div className="min-h-screen flex flex-col bg-background">
			<Navbar />
			<main className="flex-1">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
                    <Route path="/bookmarks" element={<Bookmarks />} />
                    <Route path="/article/:id" element={<ArticleDetail />} />
				</Routes>
			</main>
			<Footer />
            <Toaster />
		</div>
	);
}
