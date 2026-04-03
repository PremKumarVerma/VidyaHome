import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

type Message = {
  role: "user" | "ai";
  contents: string;
};

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    position: "relative",
  },

  // ✅ Heading
  heading: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },

  // ✅ Watermark
  watermark: {
    position: "absolute",
    top: "40%",
    left: "20%",
    fontSize: 50,
    color: "#e5e7eb",
    opacity: 0.3,
    transform: "rotate(-30deg)",
  },

  // ✅ Chat container
  chatContainer: {
    marginTop: 10,
  },

  message: {
    marginBottom: 10,
    padding: 6,
  },

  user: {
    textAlign: "right",
    color: "blue",
  },

  ai: {
    textAlign: "left",
    color: "black",
  },
});

export default function ChatPDF({ messages }: { messages: Message[] }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* 🔥 Watermark */}
        <Text style={styles.watermark}>AI CHAT</Text>

        {/* 🔥 Heading */}
        <Text style={styles.heading}>Chat Export</Text>

        {/* 🔥 Messages */}
        <View style={styles.chatContainer}>
          {messages.map((msg, i) => {
            const lines = msg.contents
              .replace(/\\n/g, "\n")
              .split("\n");

            return (
              <View key={i} style={styles.message}>
                {lines.map((line, j) => (
                  <Text
                    key={j}
                    style={msg.role === "user" ? styles.user : styles.ai}
                  >
                    {/* 👉 Convert numbering → bullets */}
                    {line.match(/^\d+\./)
                      ? `• ${line.replace(/^\d+\.\s*/, "")}`
                      : line}
                  </Text>
                ))}
              </View>
            );
          })}
        </View>

      </Page>
    </Document>
  );
}