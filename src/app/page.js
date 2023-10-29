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
    <main className="bg-green-400 flex min-h-screen flex-col items-center justify-between p-24">
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
            <a
              href="/api/auth/login"
              className="ml-4 text-teal-500 hover:text-teal-600 bg-black hover:bg-gray-100 border border-teal-500 hover:border-teal-600 rounded-lg px-4 py-2 text-sm font-medium text-white hover:text-gray"
            >
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
        <div class="text-grey-800 ">
          <section class="bg-gray-100 py-20 rounded-lg mt-20">
            <div class="container mx-auto px-4">
              <div class="flex flex-col md:flex-row items-center space-y-12">
                <div class="md:w-1/2 rounded-lg m-4 ml-8">
                  <h1 class="text-4xl font-bold leading-tight ">
                    Create a Mobile Ordering and Rewards App for Your Restaurant
                  </h1>
                  <p class="text-gray-700 mb-8">
                    With Yupon AI, you can easily create a mobile app for your
                    restaurant just by uploading your menu. You can also create
                    ad campaigns with automatically generated pictures to
                    promote your restaurant and increase sales.
                  </p>
                  <a
                    href="#"
                    class="bg-turquoise-500 hover:bg-turquoise-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Get Started
                  </a>
                </div>
                <div class="md:w-1/2 rounded-2xl p-5">
                  <img
                    src="https://via.placeholder.com/600x400"
                    alt="Mobile App Screenshot"
                    class="w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            </div>
          </section>

          <section class="bg-white py-20 mt-20 rounded-lg">
            <div class="container mx-auto px-4">
              <h2 class="text-3xl font-bold mb-8 text-center">Features</h2>
              <div class="flex flex-col md:flex-row items-center">
                <div class="md:w-1/3 mb-8 md:mb-0">
                  <div class="bg-turquoise-500 rounded-lg p-8 text-center text-white">
                    <svg
                      class="w-16 h-16 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                    </svg>
                    <h3 class="text-2xl font-bold mb-4">Mobile Ordering</h3>
                    <p class="text-gray-800">
                      Allow your customers to order from your restaurant
                      directly from their mobile devices.
                    </p>
                  </div>
                </div>
                <div class="md:w-1/3 mb-8 md:mb-0">
                  <div class="bg-turquoise-500 rounded-lg p-8 text-center text-white">
                    <svg
                      class="w-16 h-16 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                    <h3 class="text-2xl font-bold mb-4">Rewards Program</h3>
                    <p class="text-gray-800">
                      Reward your loyal customers with points that they can
                      redeem for discounts and free items.
                    </p>
                  </div>
                </div>
                <div class="md:w-1/3 mb-8 md:mb-0">
                  <div class="bg-turquoise-500 rounded-lg p-8 text-center text-white">
                    <svg
                      class="w-16 h-16 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 20h9"></path>
                      <path d="M16 5l-4 14L8 9l-4 6"></path>
                    </svg>
                    <h3 class="text-2xl font-bold mb-4">Ad Campaigns</h3>
                    <p class="text-gray-800">
                      Create ad campaigns with automatically generated pictures
                      to promote your restaurant and increase sales.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section class="bg-turquoise-500 py-20">
            <div class="container mx-auto px-4">
              <h2 class="text-3xl font-bold mb-8 text-center ">
                Ready to Get Started?
              </h2>
              <div class="flex justify-center">
                <a
                  href="#"
                  class="bg-white hover:bg-gray-100 text-turquoise-500 font-bold py-2 px-4 rounded"
                >
                  Sign Up Now
                </a>
              </div>
            </div>
          </section>
        </div>
      )}
      {user && <a href="/api/auth/logout">Logout</a>}
    </main>
  );
}
