'use client'
import React from "react";
export default async function ProfilePage({params}:any) {
    const { id }:any = await React.use(params)
  return (
    <div className="min-h-screen">
      <div className="flex justify-between mx-10 p-6 rounded-xl shadow-md mb-6">
        <h1>Profile</h1>
        <h1>{id}</h1>
      </div>
    </div>
  );
}
