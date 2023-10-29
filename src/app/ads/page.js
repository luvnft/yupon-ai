"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Ads() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  const [userInfo, setUserInfo] = useState(null);
  const [menuItems, setMenuItems] = useState([]);

  const [foodDescription, setFoodDescription] = useState("");
  const [promotion, setPromotion] = useState("");
  const [dailyBudget, setDailyBudget] = useState(0);

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
    <div className="flex flex-col items-center bg-green-100 min-h-screen py-2">
      {user && (
        <>
          <div className="flex items-center justify-between w-full px-4">
            <a href="/dashboard" className="ml-4 text-gray-600">
              Dashboard
            </a>
            <h1 className="text-3xl font-bold text-gray-900 text-center flex-1">
              Create Ad Campaigns
            </h1>
            <div className="flex items-center">
              {user && (
                <a href="/api/auth/logout" className="ml-4 text-gray-600">
                  Logout
                </a>
              )}
            </div>
          </div>
          <div className="bg-white shadow-green-400 shadow-xl p-12 rounded-lg my-auto">
            <h3 className="font-bold pb-6">Create Some Ads</h3>
            <form className="flex flex-col">
              <div className="flex flex-row">
                <label htmlFor="foodDescription">Food Description</label>
                <input
                  type="text"
                  className="form-control mb-2 mr-sm-2 mb-sm-0 w-1/2 px-3 py-2 placeholder-gray-400 text-gray-700 bg-white rounded text-base border border-gray-400 shadow-none outline-none focus:outline-none focus:ring"
                  id="foodDescription"
                  value={foodDescription}
                  onChange={(e) => setFoodDescription(e.target.value)}
                />
              </div>
              <div className="flex flex-row">
                <label htmlFor="promotion">Promotion</label>
                <input
                  type="text"
                  className="form-control mb-2 mr-sm-2 mb-sm-0 w-1/2 px-3 py-2 placeholder-gray-400 text-gray-700 bg-white rounded text-base border border-gray-400 shadow-none outline-none focus:outline-none focus:ring"
                  id="promotion"
                  value={promotion}
                  onChange={(e) => setPromotion(e.target.value)}
                />
              </div>
              <div className="flex flex-row">
                <label htmlFor="dailyBudget" className="float-left">
                  Daily Budget
                </label>
                <input
                  type="number"
                  className="form-control float-right mb-2 mr-sm-2 mb-sm-0 w-1/2 px-3 py-2 placeholder-gray-400 text-gray-700 bg-white rounded text-base border border-gray-400 shadow-none outline-none focus:outline-none focus:ring"
                  id="dailyBudget"
                  value={dailyBudget}
                  onChange={(e) => setDailyBudget(e.target.value)}
                />
              </div>
            </form>
            <button
              className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                // send post request to campaigns with a body that includes a field called budget set to 5
                axios
                  .post("/api/campaigns", {
                    foodDescription,
                    promotion,
                    dailyBudget,
                  })
                  .then((res) => {
                    console.log(res.data);
                  })
                  .catch((err) => console.log(err));
              }}
            >
              Create +
            </button>
          </div>
        </>
      )}
    </div>
  );
}
