"use client";

import React, { useState, useEffect } from "react";
import EventCard from "../_components/EventCard";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("http://localhost:3001/api/events");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${JSON.stringify(
              errorData
            )}`
          );
        }
        const data = await response.json();
        setEvents(data);
      } catch (e) {
        console.error("Fetching error:", e);
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEvents();
  }, []);

  

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Upcoming Events
      </h1>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard
              key={event.eventid}
              eventId={event.eventid}
              name={event.name}
              location={event.location}
              date={event.date}
              description={event.description}
              department={event.departmentname}
              registrationCount={event.registrationcount}
            />
          ))}
        </div>
      )}
    </div>
  );
}
