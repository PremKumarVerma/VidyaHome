import { NextRequest } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import ChatPDF from "@/components/ChatPDF";
import React from "react";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const pdfBuffer = await renderToBuffer(
      <ChatPDF messages={messages} />
    );

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=chat.pdf",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("Error generating PDF", { status: 500 });
  }
}