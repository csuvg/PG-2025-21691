import React from "react";
import { Text, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";

interface MarkdownRendererProps {
  content: string;
  style?: any;
}

export default function MarkdownRenderer({
  content,
  style,
}: MarkdownRendererProps) {
  const { theme } = useUnistyles();

  const renderMarkdown = (text: string) => {
    const lines = text.split("\n");
    const elements: React.ReactElement[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line === "") {
        continue;
      }

      if (line.startsWith("- ")) {
        elements.push(
          <Text
            key={i}
            style={{
              color: theme.colors.textPrimary,
              fontFamily: "Inter_400Regular",
              fontSize: 15,
              lineHeight: 24,
              marginBottom: theme.gap(0.5),
              marginLeft: theme.gap(1),
            }}
          >
            • {renderInlineMarkdown(line.substring(2))}
          </Text>
        );
        continue;
      }

      elements.push(
        <Text
          key={i}
          style={{
            color: theme.colors.textPrimary,
            fontFamily: "Inter_400Regular",
            fontSize: 15,
            lineHeight: 24,
            marginBottom: theme.gap(1.5),
            textAlign: "justify",
          }}
        >
          {renderInlineMarkdown(line)}
        </Text>
      );
    }

    return elements;
  };

  const renderInlineMarkdown = (text: string) => {
    const parts: (string | React.ReactElement)[] = [];
    let currentText = text;
    let keyCounter = 0;

    currentText = currentText.replace(/\*\*(.*?)\*\*/g, (match, content) => {
      const key = `bold-${keyCounter++}`;
      parts.push(
        <Text key={key} style={{ fontFamily: "Inter_600SemiBold" }}>
          {content}
        </Text>
      );
      return `__BOLD_${key}__`;
    });

    currentText = currentText.replace(/\*(.*?)\*/g, (match, content) => {
      const key = `italic-${keyCounter++}`;
      parts.push(
        <Text
          key={key}
          style={{ fontFamily: "Inter_400Regular_Italic", fontStyle: "italic" }}
        >
          {content}
        </Text>
      );
      return `__ITALIC_${key}__`;
    });

    const segments = currentText.split(/(__(?:BOLD|ITALIC)_\w+-\d+__)/);

    return segments.map((segment, index) => {
      const boldMatch = segment.match(/__BOLD_(\w+-\d+)__/);
      const italicMatch = segment.match(/__ITALIC_(\w+-\d+)__/);

      if (boldMatch) {
        return (
          parts.find(
            part => typeof part === "object" && part.key === boldMatch[1]
          ) || segment
        );
      }

      if (italicMatch) {
        return (
          parts.find(
            part => typeof part === "object" && part.key === italicMatch[1]
          ) || segment
        );
      }

      return segment;
    });
  };

  return <View style={style}>{renderMarkdown(content)}</View>;
}
