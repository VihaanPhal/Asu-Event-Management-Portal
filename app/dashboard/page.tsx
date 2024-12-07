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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isLoaded || !isSignedIn || !user) {
        setLoading(false);
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
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isLoaded, isSignedIn, user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="text-base sm:text-lg text-gray-600 animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="text-base sm:text-lg text-gray-600 text-center px-4">
          Please sign in to view your dashboard
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* User Info Section */}
      <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">
          Welcome, {user.firstName}!
        </h1>
        {userData && (
          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <p className="text-sm sm:text-base text-gray-600">
                User ID: {userData.userid}
              </p>
              <p className="text-sm sm:text-base text-gray-600">
                Name: {userData.name}
              </p>
            </div>
            <p className="text-sm sm:text-base text-gray-600">
              Type: {userData.usertype}
            </p>
            <div className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              {userEvents.length} Events Registered
            </div>
          </div>
        )}
      </div>

      {/* Registered Events Section */}
      <div className="space-y-4 sm:space-y-6">
        <h2 className="text-lg sm:text-xl font-semibold">
          Your Registered Events
        </h2>
        {userEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {userEvents.map((event) => (
              <div
                key={event.eventid}
                className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-3 sm:p-4 border-b">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 line-clamp-1">
                    {event.name}
                  </h3>
                  <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs sm:text-sm">
                    {event.department_name}
                  </span>
                </div>
                <div className="p-3 sm:p-4 space-y-3">
                  <div className="flex items-center text-xs sm:text-sm text-gray-600">
                    <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="line-clamp-1">
                      Event Date: {new Date(event.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center text-xs sm:text-sm text-gray-600">
                    <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                  <div className="flex items-center text-xs sm:text-sm text-gray-600">
                    <Users className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span>{event.registration_count} registered</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 border-t pt-2 line-clamp-2">
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
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 text-center">
            <p className="text-sm sm:text-base text-gray-500">
              You haven't registered for any events yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
