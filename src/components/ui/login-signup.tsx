"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "./card";
import { Input } from "./input";
import { Label } from "./label";
import { Button } from "./button";
import { Separator } from "./separator";
import { Chrome, Eye, EyeOff } from "lucide-react";
import LogoImg from "@/assets/logo.png"

export default function LoginCardSection() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // Helper to capitalize first letter
    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

    // Email/Password login
    const handleLogin = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);

        if (error) toast.error(capitalize(error.message));
        else {
            toast.success("Logged in successfully!");
            navigate("/dashboard");
        }
    };

    // Email/Password signup
    const handleSignup = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signUp({ email, password });
        setLoading(false);

        if (error) toast.error(capitalize(error.message));
        else toast.success("Signup successful! Check your email to confirm.");
    };

    // OAuth login (Google)
    const handleOAuth = async (provider: "google") => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: "http://localhost:5173/dashboard", // Redirect after successful login
            },
        });
        setLoading(false);

        if (error) toast.error(capitalize(error.message));
    };

    return (
       <div className="flex items-center justify-center min-h-screen bg-gradient-to-bl 
                from-black
                via-zinc-700 
                to-black text-zinc-50">

            <Card className="w-full max-w-md border-2 border-white shadow-md shadow-black bg-zinc-950 text-center">
                <CardHeader>
                    <CardTitle className="text-white text-4xl flex items-center justify-center">
                        Welcome to <img className="ml-1" src={LogoImg} alt="Relayy image" width={125} height={125} />
                    </CardTitle>
                    <CardDescription>Sign in or create an account</CardDescription>
                    <Link to="/" className="text-lg text-gray-400 hover:underline">
                        Back to Home
                    </Link>
                </CardHeader>

                <CardContent className="space-y-2">
                    {/* Email */}
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="text-zinc-50 placeholder:text-zinc-500 bg-zinc-800"
                        />
                    </div>

                    {/* Password with show/hide toggle */}
                    <div className="relative">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="mb-2 text-zinc-50 placeholder:text-zinc-500 bg-zinc-800 pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-8.5 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between gap-2">
                        <Button onClick={handleLogin} disabled={loading} className="flex-1 bg-rose-500/30 hover:bg-rose-500/50">
                            {loading ? "Loading..." : "Login"}
                        </Button>
                        <Button onClick={handleSignup} disabled={loading} className="flex-1 bg-[#4B85CB]/30 hover:bg-[#4B85CB]/50">
                            {loading ? "Loading..." : "Sign Up"}
                        </Button>
                    </div>

                    <div className="relative my-4">
                        <Separator />
                        <span className="absolute left-1/2 -translate-x-1/2 -top-2 bg-zinc-950 px-2 text-xs text-zinc-400">
                            OR
                        </span>
                    </div>

                    {/* OAuth */}
                    <div className="flex gap-2">
                        <Button
                            onClick={() => handleOAuth("google")}
                            variant="outline"
                            className="flex-1 flex items-center justify-center gap-2"
                        >
                            <Chrome className="w-4 h-4" /> Continue With Google
                        </Button>
                    </div>
                </CardContent>

                <CardFooter className="text-sm text-zinc-400 flex flex-col justify-start items-start">
                    <div>
                        Don’t have an account?
                        <span
                            className="ml-1 text-zinc-200 hover:underline cursor-pointer"
                            onClick={handleSignup}
                        >
                            Create one
                        </span>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
