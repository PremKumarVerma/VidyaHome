"use client";

import { useState } from "react";
import axios from "axios";

type Message = {
  role: "user" | "ai";
  text: string;
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const predefinedOptions = [
    "Ask Questions",
    "Create Sample Paper",
    "Create Assignments",
    "Create Notes",
  ];

  const sendMessage = async (text: string) => {
    if (!text.trim() && !file) return;

    const userText = text || (file ? `Uploaded: ${file.name}` : "");

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userText },
    ]);

    setInput("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("message", text);

      if (file) {
        formData.append("file", file);
      }

      const res = await axios.post("/api/chat", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: res.data.reply },
      ]);

      setFile(null);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Error 😓" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className=" bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg"
      >
        Chat
      </button>

      {/* Chat Box */}
      {isOpen && (
        <div
          className={`fixed bottom-10 right-5 bg-white shadow-2xl rounded-2xl flex flex-col z-50 transition-all ${
            isExpanded ? "w-[50vw] h-[90vh]" : "w-100 h-120"
          }`}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-3 border-b">
            <span className="font-semibold">Assistant 🤖</span>

            <div className="flex gap-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs px-2 py-1 bg-gray-200 rounded"
              >
                {isExpanded ? "Shrink" : "Expand"}
              </button>

              <button
                onClick={() => window.open("/chat", "_blank")}
                className="text-xs px-2 py-1 bg-gray-200 rounded"
              >
                ↗
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="text-xs px-2 py-1 bg-red-400 text-white rounded"
              >
                X
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.length === 0 && (
              <div className="text-gray-400 text-sm text-center mt-6">
                Ask me anything 👇
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg text-sm max-w-[80%] ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white ml-auto"
                    : "bg-gray-200"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="text-gray-400 text-xs">
                AI is typing...
              </div>
            )}
          </div>

          {/* Options */}
          <div className="flex gap-2 flex-wrap p-2 border-t">
            {predefinedOptions.map((opt, i) => (
              <button
                key={i}
                onClick={() => sendMessage(opt)}
                className="bg-gray-200 px-2 py-1 rounded-full text-xs"
              >
                {opt}
              </button>
            ))}
          </div>

          {/* File Preview */}
          {file && (
            <div className="text-xs text-gray-500 px-3 py-1">
              📄 {file.name}
            </div>
          )}

          {/* Input + Upload */}
          <div className="flex p-2 border-t gap-2 items-center">
            
            {/* 📎 Upload */}
            <label className="cursor-pointer bg-gray-200 px-2 py-1 rounded text-sm">
              📎
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0];
                  if (selectedFile) setFile(selectedFile);
                }}
              />
            </label>

            {/* Input */}
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type..."
              className="flex-1 border rounded px-2 py-1 text-sm"
            />

            {/* Send */}
            <button
              onClick={() => sendMessage(input)}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}