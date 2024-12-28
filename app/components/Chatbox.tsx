"use client";
import React, { useState } from "react";

const ChatBox: React.FC = () => {
  const [conversation, setConversation] = useState<
    { role: string; title: string; content: string }[]
  >([
    {
      role: "ai",
      title: "Welcome Message",
      content:
        "Hi! I'm Refella—your AI-powered reflection companion.\n\nI know how hard it can be to capture your progress and share your work in a meaningful way. That's why I'm here! I'll guide you through quick, thoughtful conversations to help you reflect, learn, and craft impactful posts that highlight your growth and expertise.",
    },
  ]);
  const [lastMessage, setLastMessage] = useState<{
    title: string;
    content: string;
  }>({
    title: "Hi! I'm Refella—your AI-powered reflection companion.",
    content:
      "I know how hard it can be to capture your progress and share your work in a meaningful way. That's why I'm here! I'll guide you through quick, thoughtful conversations to help you reflect, learn, and craft impactful posts that highlight your growth and expertise.",
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Mock AI response
  const mockAIResponse = (userMessage: string) => {
    if (userMessage.toLowerCase().includes("help")) {
      return {
        title: "Help Request",
        content:
          "Sure! Let's start by identifying your focus. What task or project would you like to reflect on?",
      };
    }
    return {
      title: "Follow-Up",
      content: "Interesting! Can you elaborate on that?",
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) {
      setError("Message cannot be empty.");
      return;
    }

    setError(""); // Clear error
    setIsLoading(true);

    // Add user message to the conversation history
    const updatedConversation = [
      ...conversation,
      { role: "user", title: "User Input", content: input },
    ];
    setConversation(updatedConversation);

    // Mock AI processing delay
    setTimeout(() => {
      const aiResponse = mockAIResponse(input);

      // Add AI response to the conversation history
      const finalConversation = [
        ...updatedConversation,
        { role: "ai", title: aiResponse.title, content: aiResponse.content },
      ];

      setConversation(finalConversation);

      // Update only the last displayed message
      setLastMessage(aiResponse);
      setInput("");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-lightLila rounded-2xl shadow-md p-6 w-full max-w-[996px] mx-auto mt-10">
      {/* Chat message */}
      <div className="h-96 overflow-y-auto p-4">
        <div className="p-8 rounded-2xl text-dark font-body text-body">
          <h2 className="font-title text-subheadingMobile md:text-subheading text-dark mb-4">
            {lastMessage.title}
          </h2>
          <p>{lastMessage.content}</p>
        </div>
        {isLoading && (
          <div className="p-3 rounded-lg text-dark mt-4">Typing...</div>
        )}
      </div>

      {/* Chat input */}
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
