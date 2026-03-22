'use client'
import axios from "axios";
import React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default async function ProfilePage({params}:any) {
    const { id }:any = await React.use(params)
    const router = useRouter()
    const [data, setData] = useState(null)
    const logOut = async () => {
      try {
        await axios.get("/api/logout");
        toast.success("Logout successful");
        router.push("/login");
      } catch (error) {
        console.error("Logout failed:", error);
        toast.error("Logout failed. Please try again.");
      }
    }

    const getUserDetails = async () => {
      try {
        const res = await axios.get("/api/me");
        console.log(res.data)
        setData(res.data.data)
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast.error("Error fetching user details. Please try again.");
      }
    }
  return (
    <div className="min-h-screen">
      <div className="flex justify-between mx-10 p-6 rounded-xl shadow-md mb-6">
        <h1>Profile</h1>
        <h1>{id}</h1>
      </div>
      <div className="flex justify-between mx-10 p-6 rounded-xl shadow-md mb-6">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={logOut}>Logout</button>
      </div>
    </div>
  );
}
