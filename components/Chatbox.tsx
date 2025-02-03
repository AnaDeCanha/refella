"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../lib/firebase";
import saveSessionTimestamp from "../utils/saveSessionTimestamp";
import incrementMessageCount from "../utils/messageCount";

const ChatBox: React.FC = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; content: string }[]
  >([
    {
      role: "ai",
      content:
        "Hi! I'm Refella—your AI-powered reflection companion. Let's start your reflection session!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionAllowed, setSessionAllowed] = useState<boolean | null>(null);
  const [sessionError, setSessionError] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  // Scroll to the latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const checkSession = async () => {
      const user = auth.currentUser;
      if (!user) {
        setSessionError("You must log in first.");
        setSessionAllowed(false);
        return;
      }

      try {
        const sessionCheck = await saveSessionTimestamp(user.email!);
        if (!sessionCheck.allowed) {
          setSessionError(sessionCheck.message);
          setSessionAllowed(false);
        } else {
          setSessionAllowed(true);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setSessionError(
          "An unexpected error occurred. Please try again later."
        );
        setSessionAllowed(false);
      }
    };

    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) {
      return;
    }

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: userMessage },
    ]);

    const messageCheck = await incrementMessageCount(auth.currentUser!.email!);
    if (!messageCheck.allowed) {
      setSessionError(messageCheck.message);
      setSessionAllowed(false);
      setIsLoading(false);
      return;
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "ai", content: "Typing..." },
    ]);

    setTimeout(() => {
      const aiResponse = "Interesting! Can you elaborate on that?"; // Mock AI response
      setMessages((prevMessages) => [
        ...prevMessages.slice(0, -1),
        { role: "ai", content: aiResponse },
      ]);
      setIsLoading(false);
    }, 1500);
  };

  if (sessionAllowed === null) {
    return (
      <div className="bg-lightLila rounded-2xl shadow-md p-6 w-full max-w-[996px] mx-auto mt-10 text-center">
        Checking session, please wait...
      </div>
    );
  }

  if (sessionAllowed === false) {
    return (
      <div className="bg-lightLila rounded-2xl shadow-md p-6 w-full max-w-[996px] mx-auto mt-10 text-center">
        <h2 className="font-title text-subheadingMobile md:text-subheading text-dark mb-4">
          Session Limit Reached
        </h2>
        <p>{sessionError}</p>
        <button
          onClick={() => router.push("/")}
          className="bg-lila text-light p-3 mt-4 rounded-lg hover:bg-lila-dark"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="bg-lightLila rounded-2xl shadow-md p-6 w-full max-w-[996px] mx-auto mt-10">
      <div
        ref={chatContainerRef}
        className="p-4 rounded-2xl text-dark font-body text-body h-80 overflow-y-auto bg-lightLila"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-3 ${
              msg.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <p
              className={`inline-block px-4 py-2 rounded-lg ${
                msg.role === "user" ? "bg-lila text-light" : "bg-calm text-dark"
              }`}
            >
              {msg.content}
            </p>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col mt-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="Type your message..."
          className="flex-1 p-3 rounded-lg border border-lila-300 focus:ring-2 focus:ring-lila resize-y"
          rows={3}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-lila text-light p-3 mt-2 rounded-lg hover:bg-lila disabled:bg-gray-400 focus:outline-none"
        >
          {isLoading ? "Generating..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
