"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Calendar, MapPin, Users, Star, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// Mock data - replace with actual data fetching logic
const getEventDetails = (eventId) => ({
  eventId: eventId,
  name: "Annual Science Fair",
  location: "Main Campus Auditorium",
  date: "2023-09-15",
  description:
    "Showcase your scientific projects and compete for prizes in our annual science fair. This event brings together students from all scientific disciplines to present their research and innovations.",
  department: "Science",
  registrationCount: 150,
  feedbacks: [
    {
      id: 1,
      userId: 1,
      userName: "John Doe",
      rating: 5,
      comment: "Excellent event! Learned a lot from other projects.",
      date: "2023-09-16",
    },
    {
      id: 2,
      userId: 2,
      userName: "Jane Smith",
      rating: 4,
      comment: "Well organized, but could use more space for presentations.",
      date: "2023-09-17",
    },
  ],
});

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.eventId;
  const event = getEventDetails(eventId);

  const [feedbacks, setFeedbacks] = useState(event.feedbacks);
  const [newFeedback, setNewFeedback] = useState({ rating: 0, comment: "" });

  const handleRatingChange = (rating) => {
    setNewFeedback((prev) => ({ ...prev, rating }));
  };

  const handleCommentChange = (e) => {
    setNewFeedback((prev) => ({ ...prev, comment: e.target.value }));
  };

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    const feedback = {
      id: feedbacks.length + 1,
      userId: 3, // This should be the actual logged-in user's ID
      userName: "Current User", // This should be the actual logged-in user's name
      rating: newFeedback.rating,
      comment: newFeedback.comment,
      date: new Date().toISOString().split("T")[0],
    };
    setFeedbacks((prev) => [...prev, feedback]);
    setNewFeedback({ rating: 0, comment: "" });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {event.name}
        </h1>
        <Badge variant="secondary" className="text-lg">
          {event.department}
        </Badge>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <Calendar className="mr-2 h-5 w-5" />
            {new Date(event.date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <MapPin className="mr-2 h-5 w-5" />
            {event.location}
          </div>
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <Users className="mr-2 h-5 w-5" />
            {event.registrationCount} registered
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            {event.description}
          </p>
          <Button className="w-full">Register for Event</Button>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Feedback
        </h2>
        {feedbacks.map((feedback) => (
          <Card key={feedback.id} className="mb-4">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${feedback.userName}`}
                  />
                  <AvatarFallback>
                    {feedback.userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{feedback.userName}</CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(feedback.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < feedback.rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                    fill={i < feedback.rating ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {feedback.comment}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Your Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitFeedback} className="space-y-4">
            <div>
              <Label htmlFor="rating">Rating</Label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-6 w-6 cursor-pointer ${
                      star <= newFeedback.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill={star <= newFeedback.rating ? "currentColor" : "none"}
                    onClick={() => handleRatingChange(star)}
                  />
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                placeholder="Share your thoughts about the event..."
                value={newFeedback.comment}
                onChange={handleCommentChange}
              />
            </div>
            <Button type="submit">Submit Feedback</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
