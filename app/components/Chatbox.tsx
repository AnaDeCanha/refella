"use client";

import { useState } from "react";

const ChatBox = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleSubmit = async () => {
    const res = await fetch("/api/generatePost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input }),
    });
    const data = await res.json();
    setOutput(data);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <textarea
        className="w-full p-2 border rounded"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="mt-2 p-2 bg-blue-500 text-white rounded"
      >
        Generate Post
      </button>
      {output && <p className="mt-4 p-2 border">{output}</p>}
    </div>
  );
};

export default ChatBox;
