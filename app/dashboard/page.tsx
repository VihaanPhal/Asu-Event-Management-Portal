"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Calendar, MapPin, Users } from "lucide-react";

type UserData = {
  userid: number;
  name: string;
  usertype: string;
};

type EventData = {
  eventid: number;
  name: string;
  location: string;
  date: string;
  description: string;
  department_name: string;
  registration_count: number;
  registration_date: string;
};

const Dashboard = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userEvents, setUserEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true); // Starts as true

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isLoaded || !isSignedIn || !user) {
        setLoading(false); // Set loading to false if not authenticated
        return;
      }

      try {
        const fullName = `${user.firstName} ${user.lastName}`;
        const response = await fetch("http://localhost:3001/api/store-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: fullName,
            userType: "Student",
          }),
        });

        if (!response.ok) throw new Error("Failed to store user");
        const data = await response.json();
        setUserData(data.user);

        if (data.user.userid) {
          const eventsResponse = await fetch(
            `http://localhost:3001/api/users/${data.user.userid}/registered-events`
          );
          if (!eventsResponse.ok) throw new Error("Failed to fetch events");

          const eventsData = await eventsResponse.json();
          setUserEvents(eventsData);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false); // Set loading to false after everything is done
      }
    };

    fetchUserData();
  }, [isLoaded, isSignedIn, user]);

  // Show loading state only if still loading
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  // Show auth required message if not signed in
  if (!isSignedIn) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-gray-600">
          Please sign in to view your dashboard
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* User Info Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user.firstName}!</h1>
        {userData && (
          <div className="space-y-2">
            <p className="text-gray-600">User ID: {userData.userid}</p>
            <p className="text-gray-600">Name: {userData.name}</p>
            <p className="text-gray-600">Type: {userData.usertype}</p>
            <div className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              {userEvents.length} Events Registered
            </div>
          </div>
        )}
      </div>

      {/* Registered Events Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Your Registered Events</h2>
        {userEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userEvents.map((event) => (
              <div
                key={event.eventid}
                className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold mb-2">{event.name}</h3>
                  <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                    {event.department_name}
                  </span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="mr-2 h-4 w-4" />
                    Event Date: {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="mr-2 h-4 w-4" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="mr-2 h-4 w-4" />
                    {event.registration_count} registered
                  </div>
                  <p className="text-sm text-gray-600 border-t pt-2">
                    {event.description}
                  </p>
                  <div className="text-xs text-gray-500 mt-2">
                    Registered on:{" "}
                    {new Date(event.registration_date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
            <p className="text-gray-500">
              You haven't registered for any events yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
