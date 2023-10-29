"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect } from "react";
import BusinessInfoForm from "./components/BusinessInfoForm";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  useEffect(() => {
    if (user) {
      fetch("/api/saveUserInfo", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data.data);
          if (!data.error) router.push("/dashboard");
        });
    }
  }, [user]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {user && (
        <>
          <div>Welcome {user.email}</div>
          <BusinessInfoForm />
        </>
      )}
      {!user && <a href="/api/auth/login">Login</a>}
      {user && <a href="/api/auth/logout">Logout</a>}
    </main>
  );
}
