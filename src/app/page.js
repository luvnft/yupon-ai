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
      <div className="flex items-center justify-between w-full px-4">
        <a href="/dashboard" className="ml-4 text-gray-600">
          Dashboard
        </a>
        <h1 className="text-3xl font-bold text-gray-900 text-center flex-1">
          Yupon AI for Businesses
        </h1>
        <div className="flex items-center">
          {user && (
            <a href="/api/auth/logout" className="ml-4 text-gray-600">
              Logout
            </a>
          )}
          {!user && (
            <a href="/api/auth/login" className="ml-4 text-gray-600">
              Login
            </a>
          )}
        </div>
      </div>
      {user && (
        <>
          <div>
            Welcome {user.email}. Please fill out some information about your
            account!
          </div>
          <BusinessInfoForm />
        </>
      )}
      {!user && (
        <a
          href="/api/auth/login"
          className="ml-4 text-teal-500 hover:text-teal-600 bg-black hover:bg-gray-100 border border-teal-500 hover:border-teal-600 rounded-lg px-4 py-2 text-sm font-medium text-white hover:text-gray"
        >
          Login
        </a>
      )}
      {user && <a href="/api/auth/logout">Logout</a>}
    </main>
  );
}
