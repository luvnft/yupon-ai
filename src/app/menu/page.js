"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Menu() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  const [userInfo, setUserInfo] = useState(null);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    if (user) {
      axios
        .get("/api/saveUserInfo", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log(res.data);
          setUserInfo(res.data.data);
          setMenuItems(res.data.data.menu_items);
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      {user && (
        <>
          <div className="flex items-center justify-between w-full px-4">
            <a href="/dashboard" className="ml-4 text-gray-600">
              Dashboard
            </a>
            <h1 className="text-3xl font-bold text-gray-900 text-center flex-1">
              Detected Menu Items
            </h1>
            <div className="flex items-center">
              {user && (
                <a href="/api/auth/logout" className="ml-4 text-gray-600">
                  Logout
                </a>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {menuItems.map((item) => (
              <div className="bg-white rounded-lg shadow-lg p-6" key={item._id}>
                <div className="relative w-full h-64">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="object-cover rounded-t-lg w-full h-full"
                  />
                </div>
                <h3 className="text-lg font-medium">{item.name}</h3>
                <div className="flex justify-between items-center mt-4">
                  <h4 className="text-gray-600">{item.points_cost} points</h4>
                  <h4 className="text-gray-600">{item.price}</h4>
                </div>
                <div className="mt-4">
                  <h4 className="text-gray-600">
                    Customer receives {item.points_received} points when
                    purchasing thru Yupon
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {!user && (
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Yupon</h1>
          <p className="mt-2 text-gray-600">
            Please login to view the menu items.
          </p>
        </div>
      )}
    </div>
  );
}
