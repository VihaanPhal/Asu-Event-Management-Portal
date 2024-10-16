"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ChevronRight,
  Calendar,
  Users,
  Bell,
  MessageSquare,
  ChevronDown,
  Menu,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [showCreators, setShowCreators] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const creators = [
    {
      name: "Vihaan Phal",
      role: "Frontend Developer",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Noah",
      role: "Backend Developer",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Mishika Chabbra",
      role: "Database Engineer",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Rishi",
      role: "UI/UX Designer",
      image: "/placeholder.svg?height=200&width=200",
    },
  ];

  const navItems = ["About", "How It Works", "Features", "Testimonials"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 font-sans">
      <header className="bg-gray-800/95 backdrop-blur-md fixed top-0 left-0 right-0 z-50 transition-all duration-300 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-amber-500">
            ASU Event Manager
          </h1>
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              {navItems.map((item, index) => (
                <li key={index}>
                  <a
                    href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                    className="hover:text-amber-400 transition-colors relative py-2"
                    onMouseEnter={() => setActiveTab(index)}
                    onMouseLeave={() => setActiveTab(-1)}
                  >
                    {item}
                    {activeTab === index && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400"
                        layoutId="underline"
                      />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <button
            className="md:hidden text-amber-500 hover:text-amber-400"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-gray-800 border-t border-gray-700"
            >
              <ul className="py-2">
                {navItems.map((item, index) => (
                  <li key={index}>
                    <a
                      href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                      className="block py-2 px-4 hover:bg-gray-700 hover:text-amber-400 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main className="pt-16 md:pt-20">
        <section className="hero container mx-auto px-4 py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div
              className="absolute inset-0 bg-gradient-to-r from-amber-500 to-red-600 transform rotate-45 translate-x-full animate-pulse"
              style={{ animationDuration: "10s" }}
            ></div>
            <div
              className="absolute inset-0 bg-gradient-to-l from-amber-500 to-red-600 transform -rotate-45 -translate-x-full animate-pulse"
              style={{ animationDuration: "15s" }}
            ></div>
          </div>
          <div className="relative z-10">
            <motion.h2
              className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-red-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Revolutionize Your Campus Events
            </motion.h2>
            <motion.p
              className="text-xl mb-8 text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Streamline planning, boost attendance, and create unforgettable
              experiences with ASU Event Manager
            </motion.p>
            <motion.button
              className="bg-amber-500 text-gray-900 px-8 py-3 rounded-full text-lg font-semibold hover:bg-amber-400 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              onClick={() => router.push("/dashboard")}
            >
              Get Started <ChevronRight className="inline-block ml-2" />
            </motion.button>
          </div>
        </section>

        <section id="about" className="py-20 relative">
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-4xl font-bold mb-8 text-center text-amber-400">
              About ASU Event Manager
            </h2>
            <p className="text-lg max-w-3xl mx-auto text-center text-gray-300">
              ASU Event Manager is a cutting-edge web application designed to
              simplify event planning and management for Arizona State
              University students, faculty, and staff. Our platform brings
              together powerful tools and intuitive interfaces to create
              seamless, engaging, and successful campus events.
            </p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-red-600/10 transform rotate-12"></div>
        </section>

        <section id="how-it-works" className="py-20 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-4xl font-bold mb-12 text-center text-amber-400">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Create Your Event",
                  description:
                    "Easily set up your event with our user-friendly interface. Add details, set dates, and customize to your heart's content.",
                  icon: Calendar,
                },
                {
                  title: "Invite Attendees",
                  description:
                    "Seamlessly invite participants using our integrated mailing system or by sharing a unique event link.",
                  icon: Users,
                },
                {
                  title: "Manage & Enjoy",
                  description:
                    "Track RSVPs, send updates, and use our tools to ensure your event runs smoothly. Then, sit back and enjoy the success!",
                  icon: Bell,
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-500/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <step.icon className="w-12 h-12 text-amber-400 mb-4" />
                  <h3 className="text-2xl font-semibold mb-4 text-amber-400">
                    {step.title}
                  </h3>
                  <p className="text-gray-300">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-tl from-amber-500/10 to-red-600/10 transform -rotate-45"></div>
        </section>

        <section id="features" className="py-20 relative">
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-4xl font-bold mb-12 text-center text-amber-400">
              Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: Calendar,
                  title: "Smart Scheduling",
                  description:
                    "AI-powered scheduling suggestions based on campus activities and attendee availability.",
                },
                {
                  icon: Users,
                  title: "Attendee Management",
                  description:
                    "Effortlessly manage guest lists, RSVPs, and send personalized communications.",
                },
                {
                  icon: Bell,
                  title: "Real-time Notifications",
                  description:
                    "Keep attendees informed with automated reminders and important updates.",
                },
                {
                  icon: MessageSquare,
                  title: "Interactive Q&A",
                  description:
                    "Engage your audience with live polls, Q&A sessions, and feedback collection.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-500/20 flex items-start"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <feature.icon className="w-8 h-8 mr-4 flex-shrink-0 text-amber-400" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-amber-400">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-red-600/10 transform rotate-180"></div>
        </section>

        <section id="testimonials" className="py-20 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-4xl font-bold mb-12 text-center text-amber-400">
              What Our Users Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah J.",
                  role: "Student Council President",
                  quote:
                    "ASU Event Manager has transformed how we organize campus events. It's a game-changer!",
                },
                {
                  name: "Dr. Michael R.",
                  role: "Professor of Computer Science",
                  quote:
                    "The ease of use and powerful features make this app indispensable for academic event planning.",
                },
                {
                  name: "Emma L.",
                  role: "Club Leader",
                  quote:
                    "We've seen a 50% increase in event attendance since we started using ASU Event Manager. Highly recommended!",
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-500/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <p className="mb-4 italic text-gray-300">
                    "{testimonial.quote}"
                  </p>
                  <p className="font-semibold text-amber-400">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-bl from-amber-500/10 to-red-600/10 transform -rotate-12"></div>
        </section>
      </main>

      <footer className="bg-gray-800 text-gray-300 py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-amber-400">
                ASU Event Manager
              </h3>
              <p>Empowering campus events, one click at a time.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-amber-400">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {["Home", "About", "Features", "Testimonials"].map(
                  (item, index) => (
                    <li key={index}>
                      <a
                        href={`#${item.toLowerCase()}`}
                        className="hover:text-amber-400 transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-amber-400">
                Support
              </h4>
              <ul className="space-y-2">
                {[
                  "FAQs",
                  "Contact Us",
                  "Privacy Policy",
                  "Terms of Service",
                ].map((item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="hover:text-amber-400 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-amber-400">
                Connect With Us
              </h4>
              <div className="flex space-x-4">
                {[
                  { name: "Facebook", icon: Facebook },
                  { name: "Twitter", icon: Twitter },
                  { name: "Instagram", icon: Instagram },
                  { name: "LinkedIn", icon: Linkedin },
                ].map((item, index) => (
                  <a
                    key={index}
                    href="#"
                    className="hover:text-amber-400 transition-colors"
                    aria-label={item.name}
                  >
                    <item.icon className="w-6 h-6" />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="text-center">
            <button
              onClick={() => setShowCreators(!showCreators)}
              className="bg-amber-500 text-gray-900 px-6 py-2 rounded-full text-lg font-semibold hover:bg-amber-400 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center mx-auto"
            >
              Meet the Creators
              <ChevronDown
                className={`ml-2 transform transition-transform ${
                  showCreators ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
          <AnimatePresence>
            {showCreators && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-8 overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {creators.map((creator, index) => (
                    <motion.div
                      key={index}
                      className="bg-gray-700 p-6 rounded-lg shadow-lg text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Image
                        src={creator.image}
                        alt={creator.name}
                        width={128}
                        height={128}
                        className="rounded-full mx-auto mb-4 object-cover"
                      />
                      <h3 className="text-xl font-semibold mb-2 text-amber-400">
                        {creator.name}
                      </h3>
                      <p className="text-gray-300">{creator.role}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p>&copy; 2024 ASU Event Manager. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
