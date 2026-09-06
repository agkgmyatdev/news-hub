import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import {
	RiUserLine,
	RiMailLine,
	RiLockLine,
	RiEyeLine,
	RiEyeOffLine,
	RiGoogleFill,
} from "react-icons/ri";
import { register, signIn } from "../lib/auth-client";
import { RegisterSchema } from "../lib/authSchema";
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

export default function Register() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	async function handleSubmit(e) {
		e.preventDefault();

		const result = RegisterSchema.safeParse({ name, email, password });

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
			const { error: authError } = await register.email(result.data);

			if (authError) {
				toast.error(authError.message);
				setLoading(false);
				return;
			}

			toast.success("Register successful");
			navigate("/");
		} catch (err) {
			console.error("Register request failed:", err);
			toast.error("Something went wrong. Please try again.");
			setLoading(false);
		}
	}

	async function handleGoogleRegister() {
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
						Create an account
					</CardTitle>
					<CardDescription>
						Register to start saving your favorite articles
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={handleSubmit}
						className="space-y-4"
						noValidate>
						<div className="space-y-2">
							<Label htmlFor="name">Name</Label>
							<div className="relative">
								<RiUserLine className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<Input
									id="name"
									type="text"
									placeholder="Full name"
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="pl-9"
								/>
							</div>
							{errors.name && (
								<p className="text-sm text-destructive">
									{errors.name}
								</p>
							)}
						</div>

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
									placeholder="At least 8 characters"
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
							{loading ? "Registering..." : "Register"}
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
						onClick={handleGoogleRegister}>
						<RiGoogleFill className="mr-2 h-4 w-4" />
						Continue with Google
					</Button>

					<p className="text-sm text-center text-muted-foreground mt-6">
						Already have an account?{" "}
						<Link
							to="/login"
							className="text-primary font-medium hover:underline">
							Login
						</Link>
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
