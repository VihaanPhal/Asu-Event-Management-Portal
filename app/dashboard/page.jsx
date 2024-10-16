import React from "react";
import { UserButton } from "@clerk/nextjs";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <UserButton />
      hello from the other side
    </div>
  );
};

export default Dashboard;
