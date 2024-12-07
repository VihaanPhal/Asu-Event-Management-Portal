"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, Users, ChevronRight, X } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function EventCard({
  eventId,
  name,
  location,
  date,
  description,
  department,
  registrationCount: initialRegistrationCount,
}) {
  const { user } = useUser();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationCount, setRegistrationCount] = useState(
    initialRegistrationCount
  );
  const [showRegistrations, setShowRegistrations] = useState(false);
  const [registrations, setRegistrations] = useState([]);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/events/${eventId}/registrations`
      );
      if (!response.ok) throw new Error("Failed to fetch registrations");
      const data = await response.json();
      setRegistrations(data);
    } catch (error) {
      console.error("Error fetching registrations:", error);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      alert("Please log in to register");
      return;
    }

    setIsRegistering(true);
    try {
      const userName = `${user.firstName} ${user.lastName}`;
      const response = await fetch(
        `http://localhost:3001/api/events/${eventId}/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userName }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to register");
      }

      const data = await response.json();
      setRegistrationCount(data.registrationCount);
      setIsRegistered(true);
      await fetchRegistrations();
      alert("Successfully registered for event!");
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "Failed to register for event");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleShowRegistrations = () => {
    setShowRegistrations(true);
    fetchRegistrations();
  };

  React.useEffect(() => {
    const checkRegistration = async () => {
      if (!user) return;
      try {
        const userName = `${user.firstName} ${user.lastName}`;
        const response = await fetch(
          `http://localhost:3001/api/events/${eventId}/check-registration`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userName }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          setIsRegistered(data.isRegistered);
        }
      } catch (error) {
        console.error("Error checking registration:", error);
      }
    };

    checkRegistration();
  }, [user, eventId]);

  return (
    <>
      <div className="w-full bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="p-3 sm:p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 break-words">
                {name}
              </h2>
              <span className="inline-block px-2 py-1 text-xs sm:text-sm bg-gray-100 text-gray-800 rounded-full">
                {department}
              </span>
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4">
          <div className="space-y-2">
            <div className="flex items-center text-xs sm:text-sm text-gray-500">
              <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
              <span className="break-words">
                {new Date(date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center text-xs sm:text-sm text-gray-500">
              <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
              <span className="break-words">{location}</span>
            </div>
            <div
              className="flex items-center text-xs sm:text-sm text-gray-500 cursor-pointer hover:text-blue-500"
              onClick={handleShowRegistrations}
            >
              <Users className="mr-2 h-4 w-4 flex-shrink-0" />
              <span>{registrationCount} registered</span>
            </div>
            <p className="mt-2 text-xs sm:text-sm text-gray-600 line-clamp-2 break-words">
              {description}
            </p>
          </div>
        </div>

        <div className="p-3 sm:p-4 border-t border-gray-200 flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between sm:items-center">
          <button
            onClick={handleRegister}
            disabled={isRegistering || isRegistered}
            className={`w-full sm:w-auto px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors
              ${
                isRegistered
                  ? "bg-gray-100 text-gray-800"
                  : "border border-gray-300 hover:bg-gray-50"
              } 
              disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isRegistering
              ? "Registering..."
              : isRegistered
              ? "Registered"
              : "Register"}
          </button>

          <Link
            href={`/dashboard/events/${eventId}`}
            className="w-full sm:w-auto"
          >
            <button className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center sm:justify-start">
              View Details
              <ChevronRight className="ml-2 h-4 w-4" />
            </button>
          </Link>
        </div>
      </div>

      {showRegistrations && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden">
            <div className="p-3 sm:p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-base sm:text-lg font-semibold">
                Registered Participants
              </h3>
              <button
                onClick={() => setShowRegistrations(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>

            <div className="max-h-[60vh] sm:max-h-[400px] overflow-y-auto p-3 sm:p-4">
              {registrations.length > 0 ? (
                <div className="space-y-2">
                  {registrations.map((reg) => (
                    <div
                      key={reg.registrationid}
                      className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-2 border-b gap-1"
                    >
                      <div>
                        <p className="font-medium text-sm sm:text-base">
                          {reg.user_name}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {reg.usertype}
                        </p>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {new Date(reg.registration_date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-xs sm:text-sm text-gray-500 py-4">
                  No registrations yet
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
