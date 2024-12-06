"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, MapPin, Users, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function EventCard({
  eventId,
  name,
  location,
  date,
  description,
  department,
  registrationCount: initialRegistrationCount,
}) {
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
    setIsRegistering(true);
    try {
      const userId = 1; // Default user ID since we're not checking login
      const response = await fetch(
        `http://localhost:3001/api/events/${eventId}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
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
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleShowRegistrations = () => {
    setShowRegistrations(true);
    fetchRegistrations();
  };

  return (
    <>
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-bold">{name}</CardTitle>
              <Badge variant="secondary">{department}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="mr-2 h-4 w-4" />
              {new Date(date).toLocaleDateString()}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="mr-2 h-4 w-4" />
              {location}
            </div>
            <div
              className="flex items-center text-sm text-gray-500 cursor-pointer hover:text-blue-500"
              onClick={handleShowRegistrations}
            >
              <Users className="mr-2 h-4 w-4" />
              {registrationCount} registered
            </div>
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
              {description}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant={isRegistered ? "secondary" : "outline"}
            size="sm"
            onClick={handleRegister}
            disabled={isRegistering || isRegistered}
          >
            {isRegistering
              ? "Registering..."
              : isRegistered
              ? "Registered"
              : "Register"}
          </Button>
          <Link href={`/dashboard/events/${eventId}`}>
            <Button variant="ghost" size="sm">
              View Details
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>

      <Dialog open={showRegistrations} onOpenChange={setShowRegistrations}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registered Participants</DialogTitle>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto">
            {registrations.length > 0 ? (
              <div className="space-y-2">
                {registrations.map((reg) => (
                  <div
                    key={reg.registrationid}
                    className="flex justify-between items-center p-2 border-b"
                  >
                    <div>
                      <p className="font-medium">{reg.user_name}</p>
                      <p className="text-sm text-gray-500">{reg.usertype}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(reg.registration_date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">
                No registrations yet
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
