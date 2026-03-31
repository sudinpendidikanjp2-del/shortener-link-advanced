"use client";
import { useAuth } from "@/components/auth-provider";
import { Spinner } from "@/components/ui/spinner";
import { redirect } from "next/navigation";

export default function HomePage() {
  const { user, isLoading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (user) {
    redirect("/dashboard");
  }

  redirect("/login");
}
