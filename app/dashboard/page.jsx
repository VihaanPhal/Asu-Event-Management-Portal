"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

const Dashboard = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      const storeUser = async () => {
        try {
          const response = await fetch("http://localhost:3001/api/store-user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: `${user.firstName} ${user.lastName}`,
              userType: "Student", // Default to Student
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to store user");
          }

          const data = await response.json();
          console.log("User stored successfully:", data);
          setDashboardData(data.user);
        } catch (error) {
          console.error("Error storing user:", error);
        }
      };

      storeUser();
    }
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded || !isSignedIn) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.firstName}!</h1>
      {dashboardData && (
        <div>
          <p>User ID: {dashboardData.userid}</p>
          <p>Name: {dashboardData.name}</p>
          <p>User Type: {dashboardData.usertype}</p>
        </div>
      )}
      <p className="mt-4">Your dashboard content here</p>
    </div>
  );
};

export default Dashboard;
