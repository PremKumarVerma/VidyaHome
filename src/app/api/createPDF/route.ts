import { NextRequest } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
} from "@react-pdf/renderer";

type Message = {
  role: "user" | "ai";
  contents: string;
};

const ChatPDF = ({ messages }: { messages: Message[] }) => {
  const content = messages.map(m => m.contents).join("\n");

  let lines = content
    .replace(/\\n/g, "\n")
    .split("\n")
    .map(l => l.trim())
    .filter(l => l !== "");

  // 🔥 FIND START OF MAIN CONTENT
  const startIndex = lines.findIndex(line => {
    const lower = line.toLowerCase();
    return (
      lower.includes("mark") ||
      lower.includes("section") ||
      /^\d+\./.test(line)
    );
  });

  if (startIndex !== -1) {
    lines = lines.slice(startIndex);
  }

  // 🔥 REMOVE unwanted intro leftovers
  lines = lines.filter(line => {
    const lower = line.toLowerCase();
    return !(
      lower.includes("here") ||
      lower.includes("this") ||
      lower.includes("the following") ||
      lower.includes("important questions") ||
      lower.includes("generated") ||
      lower.includes("chatbot")
    );
  });

  // 🔥 REMOVE bullets (*, •, -)
  lines = lines.map(line =>
    line.replace(/^[•*\-]\s*/, "")
  );

  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      {
        size: "A4",
        style: {
          padding: 30,
          fontSize: 12,
          position: "relative",
        },
      },

      // 🔥 Watermark
      React.createElement(
        Text,
        {
          style: {
            position: "absolute",
            top: "40%",
            left: "15%",
            fontSize: 60,
            color: "#e5e7eb",
            opacity: 1,
            transform: "rotate(-30deg)",
          },
        },
        "VidyaHome"
      ),

      // 🔥 Heading
      React.createElement(
        Text,
        {
          style: {
            fontSize: 20,
            textAlign: "center",
            marginBottom: 10,
            fontWeight: "bold",
          },
        },
        "Sample Question Paper"
      ),

      // 🔥 Time + Marks
      React.createElement(
        View,
        {
          style: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 15,
          },
        },
        React.createElement(Text, null, "Time: 3 Hours"),
        React.createElement(Text, null, "Max Marks: 100")
      ),

      // Divider
      React.createElement(
        Text,
        { style: { marginBottom: 10 } },
        "--------------------------------------------"
      ),

      // 🔥 FINAL CONTENT WITH SECTION SPACING
      React.createElement(
        View,
        null,
        (() => {
          let questionNumber = 1;

          return lines.flatMap((line, i) => {
            const lower = line.toLowerCase();

            // 🔥 Remove all * anywhere
            line = line.replace(/\*/g, "").trim();

            let elements = [];

            // 🟣 Section Heading
            if (lower.includes("section")) {
              // Add spacing before section (except first)
              if (i !== 0) {
                elements.push(
                  React.createElement(Text, {
                    key: `space-${i}`,
                    style: { marginBottom: 8 },
                  }, " ")
                );
              }

              elements.push(
                React.createElement(
                  Text,
                  {
                    key: `section-${i}`,
                    style: {
                      fontSize: 14,
                      fontWeight: "bold",
                      marginTop: 10,
                      marginBottom: 5,
                    },
                  },
                  line
                )
              );

              return elements;
            }

            // 🔵 Marks Heading
            if (lower.includes("mark")) {
              return [
                React.createElement(
                  Text,
                  {
                    key: `marks-${i}`,
                    style: {
                      fontWeight: "bold",
                      marginBottom: 5,
                    },
                  },
                  line
                )
              ];
            }

            // 🟢 Question (FIXED NUMBERING)
            const cleanText = line.replace(/^\d+\.\s*/, "");
            const text = `${questionNumber}. ${cleanText}`;
            questionNumber++;

            return [
              React.createElement(
                Text,
                {
                  key: `q-${i}`,
                  style: { marginBottom: 5 },
                },
                text
              )
            ];
          });
        })()
      )
    )
  );
};

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response("Invalid messages", { status: 400 });
    }

    const cleanedMessages = messages.map((msg: any) => ({
      ...msg,
      contents: msg.contents.replace(/\\n/g, "\n"),
    }));

    const pdfBuffer = await renderToBuffer(
      React.createElement(ChatPDF, { messages: cleanedMessages })
    );

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=ai-response.pdf",
      },
    });
  } catch (error) {
    console.error("PDF Generation Error:", error);
    return new Response("Error generating PDF", { status: 500 });
  }
}