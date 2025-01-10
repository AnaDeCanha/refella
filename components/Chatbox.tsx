"use client";
import React, { useState } from "react";
import { auth } from "../lib/firebase";
import saveSessionTimestamp from "../utils/saveSessionTimestamp";
import incrementMessageCount from "../utils/messageCount"; // Corrected import

const ChatBox: React.FC = () => {
  const [lastMessage, setLastMessage] = useState({
    role: "ai",
    title: "Welcome Message",
    content:
      "Hi! I'm Refella—your AI-powered reflection companion.\n\nI know how hard it can be to capture your progress and share your work in a meaningful way. That's why I'm here! I'll guide you through quick, thoughtful conversations to help you reflect, learn, and craft impactful posts that highlight your growth and expertise.",
  });

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const mockAIResponse = (userMessage: string) => {
    if (userMessage.toLowerCase().includes("help")) {
      return {
        title: "Help Request",
        content:
          "Sure! Let's start by identifying your focus. What task or project would you like to reflect on?",
      };
    } else if (userMessage.toLowerCase().includes("progress")) {
      return {
        title: "Progress Reflection",
        content:
          "Great! Can you tell me about the progress you've made recently? What are you most proud of?",
      };
    } else if (userMessage.toLowerCase().includes("challenge")) {
      return {
        title: "Challenge Discussion",
        content:
          "Challenges are part of growth. What's been the most significant challenge for you recently?",
      };
    } else {
      return {
        title: "Follow-Up",
        content: "Interesting! Can you elaborate on that?",
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if the user is logged in first
    const user = auth.currentUser;
    if (!user) {
      setError("You must log in first.");
      return;
    }

    // Check if the input is empty
    if (!input.trim()) {
      setError("Message cannot be empty.");
      return;
    }

    setError("");
    setIsLoading(true);

    // Verify session and message count
    const sessionCheck = await saveSessionTimestamp(user.email!);
    if (!sessionCheck.allowed) {
      setError(sessionCheck.message);
      setIsLoading(false);
      return;
    }

    // Increment message count
    await incrementMessageCount(user.email!);

    // Update last message with user's input
    setLastMessage({
      role: "user",
      title: "Your Message",
      content: input,
    });

    setTimeout(() => {
      // Generate mock AI response
      const aiResponse = mockAIResponse(input);

      // Update last message with AI response
      setLastMessage({
        role: "ai",
        title: aiResponse.title,
        content: aiResponse.content,
      });

      setInput(""); // Clear input field
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-lightLila rounded-2xl shadow-md p-6 w-full max-w-[996px] mx-auto mt-10">
      <div className="p-8 rounded-2xl text-dark font-body text-body">
        <h2 className="font-title text-subheadingMobile md:text-subheading text-dark mb-4">
          {lastMessage.title}
        </h2>
        <p>{lastMessage.content}</p>
        {isLoading && <div className="mt-4 text-dark">Typing...</div>}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col mt-4">
        <p
          className={`text-red-500 mb-2 h-6 ${error ? "visible" : "invisible"}`}
        >
          {error}
        </p>
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
          className="flex-1 p-3 rounded-lg border border-lila-300 focus:outline-none focus:ring-2 focus:ring-lila resize-y"
          rows={3}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-lila text-light p-3 mt-2 rounded-lg hover:bg-lila disabled:bg-gray-400 ring-2 ring-lila focus:outline-none"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
