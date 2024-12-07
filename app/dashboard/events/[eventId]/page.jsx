"use client";
import React, { useState } from "react";
import { Calendar, MapPin, Users, Star, MessageSquare } from "lucide-react";

// Mock data function - replace with actual data fetching
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

const EventDetailPage = ({ eventId = "1" }) => {
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
      userId: 3,
      userName: "Current User",
      rating: newFeedback.rating,
      comment: newFeedback.comment,
      date: new Date().toISOString().split("T")[0],
    };
    setFeedbacks((prev) => [...prev, feedback]);
    setNewFeedback({ rating: 0, comment: "" });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {event.name}
        </h1>
        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
          {event.department}
        </span>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
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
        <p className="text-gray-600 dark:text-gray-300">{event.description}</p>
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors">
          Register for Event
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Feedback
        </h2>
        {feedbacks.map((feedback) => (
          <div
            key={feedback.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow mb-4"
          >
            <div className="p-4 border-b dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  {feedback.userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <div className="font-semibold">{feedback.userName}</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(feedback.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4">
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
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b dark:border-gray-700">
          <h3 className="text-xl font-semibold">Add Your Feedback</h3>
        </div>
        <div className="p-4">
          <form onSubmit={handleSubmitFeedback} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Rating
              </label>
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Comment
              </label>
              <textarea
                className="w-full px-3 py-2 border rounded-md dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Share your thoughts about the event..."
                value={newFeedback.comment}
                onChange={handleCommentChange}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
            >
              Submit Feedback
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
