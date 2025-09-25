/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./card";
import { Input } from "./input";
import { Label } from "./label";
import { Button } from "./button";
import { Separator } from "./separator";
import { Chrome, Eye, EyeOff } from "lucide-react";
import LogoImg from "@/assets/logo.png";

type Tab = "login" | "signup";

export default function LoginCardSection() {
  const [tab, setTab] = useState<Tab>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const handleSubmit = async () => {
    setFormError(null);
    if (!email || !password || (tab === "signup" && !name)) {
      setFormError("Email, password, and name are required.");
      return;
    }

    setLoading(true);
    try {
      let user;

      if (tab === "login") {
        const { error, data } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        user = data.user;
      } else {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        user = signUpData.user;

        if (user) {
          const { error: updateError } = await supabase.auth.updateUser({ data: { full_name: name } });
          if (updateError) throw updateError;
        }
      }

      if (!user) throw new Error("User not found");

      // ✅ Fetch user's workspaces
      const { data: wsData, error: wsError } = await supabase
        .from("workspace_members")
        .select("workspace_id")
        .eq("user_id", user.id);

      if (wsError) throw wsError;

      if (!wsData || wsData.length === 0) {
        // ✅ No workspaces: redirect to create/join
        navigate("/workspace/create-join");
      } else {
        // ✅ Workspaces exist: redirect to recent or first workspace
        const recentWorkspaceId = localStorage.getItem("recentWorkspace");
        const targetWorkspace = recentWorkspaceId || wsData[0].workspace_id;
        navigate(`/workspace/${targetWorkspace}`);
      }

      toast.success(tab === "login" ? "Logged in successfully!" : "Signup successful! Check your email to confirm.");
    } catch (err: any) {
      setFormError(capitalize(err.message));
    } finally {
      setLoading(false);
    }
  };


const handleOAuth = async (provider: "google") => {
  setLoading(true);
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin }, // redirect back to app
    });

    if (error) throw error;

    // After redirect back, check user session
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;
    if (!user) throw new Error("User not found");

    // Fetch user's workspaces
    const { data: wsData, error: wsError } = await supabase
      .from("workspace_members")
      .select("workspace_id")
      .eq("user_id", user.id);

    if (wsError) throw wsError;

    if (!wsData || wsData.length === 0) {
      navigate("/workspace/create-join");
    } else {
      const recentWorkspaceId = localStorage.getItem("recentWorkspace");
      const targetWorkspace = recentWorkspaceId || wsData[0].workspace_id;
      navigate(`/workspace/${targetWorkspace}`);
    }

    toast.success("Logged in successfully with Google!");
  } catch (err: any) {
    toast.error(capitalize(err.message));
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-bl from-black via-zinc-700 to-black text-zinc-50 p-4">
      <Card className="w-full max-w-md border-2 border-white shadow-md shadow-black bg-zinc-950 text-center">
        <CardHeader>
          <CardTitle className="text-white text-4xl flex items-center justify-center">
            Welcome to <img className="ml-1" src={LogoImg} alt="Relayy" width={125} height={125} />
          </CardTitle>
          <CardDescription>Sign in or create an account</CardDescription>

          <div className="flex justify-center gap-4 mt-4">
            <button
              className={`px-4 py-2 rounded-t-lg ${tab === "login" ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400"}`}
              onClick={() => setTab("login")}
            >
              Login
            </button>
            <button
              className={`px-4 py-2 rounded-t-lg ${tab === "signup" ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400"}`}
              onClick={() => setTab("signup")}
            >
              Sign Up
            </button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 mt-2">
          {tab === "signup" && (
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="text-zinc-50 placeholder:text-zinc-500 bg-zinc-800"
              />
            </div>
          )}

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

          <div className="relative">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="text-zinc-50 placeholder:text-zinc-500 bg-zinc-800 pr-10"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-8 -translate-y-1/2 text-zinc-400 hover:text-zinc-200">
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {formError && <p className="text-red-500 text-sm">{formError}</p>}

          <Button onClick={handleSubmit} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
            {loading ? "Loading..." : tab === "login" ? "Login" : "Sign Up"}
          </Button>

          <div className="relative my-4">
            <Separator />
            <span className="absolute left-1/2 -translate-x-1/2 -top-2 bg-zinc-950 px-2 text-xs text-zinc-400">OR</span>
          </div>

          <Button onClick={() => handleOAuth("google")} variant="outline" className="flex items-center justify-center gap-2 w-full" disabled={loading}>
            <Chrome className="w-4 h-4" /> Continue with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
