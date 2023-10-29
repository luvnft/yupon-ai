"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";
import { storage } from "@/utils/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  const [userInfo, setUserInfo] = useState(null);

  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  const [percent, setPercent] = useState(0);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!image) {
      alert("Please choose a file first!");
    }

    const storageRef = ref(storage, `/files/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        // update progress
        setPercent(percent);
      },
      (err) => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log(url);
          setUrl(url);
          // use axios to send url to backend endpoint /api/createMenuItemsFromImage
          axios
            .post("/api/createMenuItemsFromImage", {
              image_url: url,
            })
            .then((res) => {
              console.log(res);
              router.push("/menu");
            });
        });
      }
    );
  };

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
          setUserInfo(data.data);
        });
    }
  }, [user]);

  return (
    <main className="flex min-h-screen flex-col items-center  ">
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
        </div>
      </div>
      {user && (
        <>
          <div className="text-2xl my-16 ">
            Welcome {user.email}. This is your dashboard.
          </div>
        </>
      )}
      {user &&
        userInfo &&
        (!userInfo.menu_items ||
          (userInfo.menu_items && userInfo.menu_items.length == 0)) && (
          <>
            <div className="my-6">
              You have not created any menu items yet. Upload a picture of your
              menu to automatically generate mobile ordering and rewards points
              system.
            </div>
            <div>
              <input type="file" onChange={handleChange} accept="" />
              <button
                className="ml-4 text-teal-500 hover:text-teal-600 bg-black hover:bg-gray-100 border border-teal-500 hover:border-teal-600 rounded-lg px-4 py-2 text-sm font-medium text-white hover:text-gray"
                onClick={handleUpload}
              >
                Upload
              </button>
              <br />
            </div>
            <div>
              <p>{percent} "% done"</p>
            </div>
          </>
        )}
      {user &&
        userInfo &&
        userInfo.menu_items &&
        userInfo.menu_items.length > 0 && (
          <div>
            <Link
              href="/menu"
              className="ml-4 text-teal-500 hover:text-teal-600 bg-black hover:bg-gray-100 border border-teal-500 hover:border-teal-600 rounded-lg px-4 py-2 text-sm font-medium text-white hover:text-gray"
            >
              Edit Menu
            </Link>

            <Link
              href="/ads"
              className="ml-4 text-teal-500 hover:text-teal-600 bg-black hover:bg-gray-100 border border-teal-500 hover:border-teal-600 rounded-lg px-4 py-2 text-sm font-medium text-white hover:text-gray"
            >
              Create Ad Campaign
            </Link>
          </div>
        )}
      {!user && <a href="/api/auth/login">Login</a>}
    </main>
  );
}
