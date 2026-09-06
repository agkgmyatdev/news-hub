import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import {
	RiMailLine,
	RiLockLine,
	RiEyeLine,
	RiEyeOffLine,
	RiGoogleFill,
} from "react-icons/ri";
import { signIn } from "../lib/auth-client";
import { LoginSchema } from "../lib/authSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	async function handleSubmit(e) {
		e.preventDefault();

		const result = LoginSchema.safeParse({ email, password });

		if (!result.success) {
			const fieldErrors = {};
			result.error.issues.forEach((issue) => {
				fieldErrors[issue.path[0]] = issue.message;
			});
			setErrors(fieldErrors);
			return;
		}

		setErrors({});
		setLoading(true);

		try {
			const { error: authError } = await signIn.email(result.data);

			if (authError) {
				toast.error(authError.message);
				setLoading(false);
				return;
			}

			toast.success("Login successful");
			navigate("/");
		} catch (err) {
			console.error("Login request failed:", err);
			toast.error("Something went wrong. Please try again.");
			setLoading(false);
		}
	}

	async function handleGoogleLogin() {
		await signIn.social({
			provider: "google",
			callbackURL: `${window.location.origin}/`,
		});
	}

	return (
		<div className="min-h-full flex items-center justify-center px-4 py-12">
			<Card className="w-full max-w-sm shadow-lg border-border/50">
				<CardHeader className="space-y-1 text-center">
					<CardTitle className="text-2xl font-bold">
						Welcome back
					</CardTitle>
					<CardDescription>
						Login to your account to continue
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={handleSubmit}
						className="space-y-4"
						noValidate>
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<div className="relative">
								<RiMailLine className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<Input
									id="email"
									type="email"
									placeholder="you@example.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="pl-9"
								/>
							</div>
							{errors.email && (
								<p className="text-sm text-destructive">
									{errors.email}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<div className="relative">
								<RiLockLine className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									placeholder="••••••••"
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									className="pl-9 pr-9"
								/>
								<button
									type="button"
									onClick={() =>
										setShowPassword(!showPassword)
									}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
									tabIndex={-1}>
									{showPassword ? (
										<RiEyeOffLine className="h-4 w-4" />
									) : (
										<RiEyeLine className="h-4 w-4" />
									)}
								</button>
							</div>
							{errors.password && (
								<p className="text-sm text-destructive">
									{errors.password}
								</p>
							)}
						</div>

						<Button
							type="submit"
							className="w-full"
							disabled={loading}>
							{loading ? "Logging in..." : "Login"}
						</Button>
					</form>

					<div className="relative my-4">
						<Separator />
						<span className="absolute inset-0 flex items-center justify-center">
							<span className="bg-card px-2 text-xs text-muted-foreground">
								OR
							</span>
						</span>
					</div>

					<Button
						type="button"
						variant="outline"
						className="w-full"
						onClick={handleGoogleLogin}>
						<RiGoogleFill className="mr-2 h-4 w-4" />
						Continue with Google
					</Button>

					<p className="text-sm text-center text-muted-foreground mt-6">
						Don't have an account?{" "}
						<Link
							to="/register"
							className="text-primary font-medium hover:underline">
							Register
						</Link>
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
