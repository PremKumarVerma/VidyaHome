"use client";

import { useState } from "react";
import axios from "axios";

type Message = {
  role: "user" | "ai";
  text: string;
};

export default function FullChatPage() {
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

    // ✅ Add user message
    const userText = text || (file ? `Uploaded: ${file.name}` : "");
    setMessages((prev) => [...prev, { role: "user", text: userText }]);

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

      // ✅ AI response
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: res.data.reply },
      ]);

      setFile(null);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Error processing request 😓" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      
      {/* Header */}
      <div className="p-4 border-b font-bold text-lg flex justify-between">
        <span>Chat Assistant 🤖</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-gray-400 text-center mt-10">
            Start a conversation 👇
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg max-w-md ${
              msg.role === "user"
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-200"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <div className="text-gray-400 text-sm">AI is typing...</div>
        )}
      </div>

      {/* Options */}
      <div className="flex gap-2 flex-wrap p-3 border-t bg-white">
        {predefinedOptions.map((opt, i) => (
          <button
            key={i}
            onClick={() => sendMessage(opt)}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-1 rounded-full text-sm"
          >
            {opt}
          </button>
        ))}
      </div>

      {/* File Preview */}
      {file && (
        <div className="text-xs text-gray-500 px-4 py-1">
          📄 {file.name}
        </div>
      )}

      {/* Input + Upload */}
      <div className="flex p-3 border-t bg-white gap-2 items-center">
        
        {/* 📎 Upload */}
        <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded">
          📎
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];
              if (selectedFile) {
                setFile(selectedFile);
              }
            }}
          />
        </label>

        {/* Input */}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border rounded px-3 py-2"
        />

        {/* Send */}
        <button
          onClick={() => sendMessage(input)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}