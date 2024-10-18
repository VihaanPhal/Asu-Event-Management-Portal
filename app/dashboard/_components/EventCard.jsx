import React from "react";
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

export default function EventCard({
  eventId,
  name,
  location,
  date,
  description,
  department,
  registrationCount,
}) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{name}</CardTitle>
        <Badge variant="secondary">{department}</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="mr-2 h-4 w-4" />
            {new Date(date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <MapPin className="mr-2 h-4 w-4" />
            {location}
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Users className="mr-2 h-4 w-4" />
            {registrationCount} registered
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {description}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          Register
        </Button>
        <Link href={`/dashboard/events/${eventId}`}>
          <Button variant="ghost" size="sm">
            View Details
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
