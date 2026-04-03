import { NextRequest } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import ChatPDF from "@/components/ChatPDF";
import React from "react";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // ✅ Validation
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response("Invalid messages", { status: 400 });
    }

    // ✅ Clean message content (fix \n issue)
    const cleanedMessages = messages.map((msg: any) => ({
      ...msg,
      contents: msg.contents.replace(/\\n/g, "\n"),
    }));

    // ✅ Generate PDF buffer
    const pdfBuffer = await renderToBuffer(
        React.createElement(ChatPDF, { messages: cleanedMessages })
    );

    // ✅ Send PDF as response
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