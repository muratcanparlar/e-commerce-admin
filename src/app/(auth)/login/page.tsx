"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type LoginForm = { email: string; password: string };

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm<LoginForm>();
  const router = useRouter();

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Login failed");

      // cookies are set by the server route -> redirect client
      router.push("/");
    } catch (err: any) {
      const message = err instanceof Error ? err.message : String(err);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-2xl border bg-white p-8 shadow">
        <h1 className="mb-6 text-center text-2xl font-semibold">Login</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="you@example.com"
              {...register("email", { required: true })}
            />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="••••••••"
              {...register("password", { required: true })}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}
