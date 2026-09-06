import { Link } from "react-router";
import { RiMenuLine } from "react-icons/ri";
import { useSession, signOut } from "../lib/auth-client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetTrigger,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { ModeToggle } from "./ModeToggle";

export default function Navbar() {
	const { data: session } = useSession();

	return (
		<nav className="flex items-center gap-4 px-4 sm:px-6 py-4 border-b">
			<Link to="/" className="font-bold text-lg">
				NewsHub
			</Link>

			<Separator orientation="vertical" className="h-6 hidden sm:block" />
			<div className="hidden sm:flex items-center gap-2">
				<Button variant="ghost" asChild>
					<Link to="/">Home</Link>
				</Button>
				<Button variant="ghost" asChild>
					<Link to="/bookmarks">Bookmarks</Link>
				</Button>
			</div>

			<div className="ml-auto flex items-center gap-2 sm:gap-3">
				<ModeToggle />

				<div className="hidden sm:flex items-center gap-3">
					{session ? (
						<>
							<span className="text-sm text-muted-foreground">
								Hi, {session.user.name}
							</span>
							<Button variant="outline" onClick={() => signOut()}>
								Logout
							</Button>
						</>
					) : (
						<>
							<Button variant="ghost" asChild>
								<Link to="/login">Login</Link>
							</Button>
							<Button asChild>
								<Link to="/register">Register</Link>
							</Button>
						</>
					)}
				</div>

				<Sheet>
					<SheetTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							className="sm:hidden">
							<RiMenuLine className="h-5 w-5" />
						</Button>
					</SheetTrigger>
					<SheetContent side="right">
						<SheetHeader>
							<SheetTitle>Menu</SheetTitle>
						</SheetHeader>
						<div className="flex flex-col gap-1 px-4">
							<Button
								variant="ghost"
								asChild
								className="justify-start">
								<Link to="/">Home</Link>
							</Button>
							<Button
								variant="ghost"
								asChild
								className="justify-start">
								<Link to="/bookmarks">Bookmarks</Link>
							</Button>

							<Separator className="my-3" />

							{session ? (
								<div className="flex flex-col gap-3">
									<p className="text-sm text-muted-foreground px-2">
										Signed in as{" "}
										<span className="font-medium text-foreground">
											{session.user.name}
										</span>
									</p>
									<Button
										variant="outline"
										onClick={() => signOut()}
										className="w-full">
										Logout
									</Button>
								</div>
							) : (
								<div className="flex flex-col gap-2">
									<Button
										variant="outline"
										asChild
										className="w-full">
										<Link to="/login">Login</Link>
									</Button>
									<Button asChild className="w-full">
										<Link to="/register">Register</Link>
									</Button>
								</div>
							)}
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</nav>
	);
}
