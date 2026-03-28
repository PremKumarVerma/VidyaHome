"use client";

import { useState } from "react";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const predefinedOptions = [
    "Ask Questions",
    "Create Sample Paper",
  ];

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, input]);
    setInput("");
  };

  const handleOptionClick = (option: string) => {
    setMessages((prev) => [...prev, option]);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg z-50"
      >
        Chat
      </button>

      {/* Chat Box */}
      {isOpen && (
        <div
          className={`fixed bottom-20 right-5 bg-white shadow-2xl rounded-2xl flex flex-col z-50 transition-all ${
            isExpanded ? "w-[50vw] h-[50vh]" : "w-80 h-96"
          }`}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-3 border-b">
            <span className="font-semibold">Mini Chat</span>

            <div className="flex gap-2">
              {/* Expand */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-sm px-2 py-1 bg-gray-200 rounded"
              >
                {isExpanded ? "Shrink" : "Expand"}
              </button>

              {/* Open in New Tab */}
              <button
                onClick={() => window.open("/chat", "_blank")}
                className="text-sm px-2 py-1 bg-gray-200 rounded"
              >
                ↗
              </button>

              {/* Close */}
              <button
                onClick={() => setIsOpen(false)}
                className="text-sm px-2 py-1 bg-red-400 text-white rounded"
              >
                X
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className="bg-blue-100 p-2 rounded-lg text-sm"
              >
                {msg}
              </div>
            ))}
          </div>

          {/* Options */}
          <div className="flex gap-2 flex-wrap p-2 border-t">
            {predefinedOptions.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleOptionClick(opt)}
                className="bg-gray-200 px-3 py-1 rounded-full text-sm"
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex p-2 border-t gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border rounded px-2 py-1 text-sm"
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}