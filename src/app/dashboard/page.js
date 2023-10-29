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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {user && (
        <>
          <div>Welcome {user.email}. This is your dashboard.</div>
        </>
      )}
      {user &&
        userInfo &&
        (!userInfo.menu_items ||
          (userInfo.menu_items && userInfo.menu_items.length == 0)) && (
          <>
            <div>You have not created any menu items yet.</div>
            <div>
              <input type="file" onChange={handleChange} accept="" />
              <button onClick={handleUpload}>Upload</button>
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
            <Link href="/menu">Edit Menu</Link>

            <Link
              href="/ads"
              className="ml-4 text-turquoise-500 hover:text-turquoise-600"
            >
              Create Ad Campaign
            </Link>
          </div>
        )}
      {!user && <a href="/api/auth/login">Login</a>}
      {user && <a href="/api/auth/logout">Logout</a>}
    </main>
  );
}
