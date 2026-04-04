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

