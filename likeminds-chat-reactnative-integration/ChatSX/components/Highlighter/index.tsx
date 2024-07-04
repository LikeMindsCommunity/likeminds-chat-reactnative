import React from "react";
import { Text, TextStyle, TextProps } from "react-native";
import { decodeTaggingRoute } from "../../commonFuctions";

// Define the prop types
interface HighlighterProps extends TextProps {
  autoEscape?: boolean;
  highlightStyle?: (TextStyle | null)[];
  searchWords: string[];
  textToHighlight: string;
  sanitize?: (text: string) => string;
  style?: (TextStyle | null)[];
}

// Function to escape special characters in a string for use in a regular expression
const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// Function to split text into chunks based on the search words
const findAll = ({
  textToHighlight,
  searchWords,
  sanitize,
  autoEscape,
}: {
  textToHighlight: string;
  searchWords: string[];
  sanitize?: (text: string) => string;
  autoEscape?: boolean;
}) => {
  if (autoEscape) {
    searchWords = searchWords.map(escapeRegExp);
  }

  if (sanitize) {
    textToHighlight = sanitize(textToHighlight);
    searchWords = searchWords.map(sanitize);
  }

  const chunks: any = [];
  let lastIndex = 0;

  searchWords.forEach((word) => {
    const regex = new RegExp(`${escapeRegExp(word)}`, "i");

    while (lastIndex < textToHighlight.length) {
      const remainingText = textToHighlight.substring(lastIndex);
      const match = regex.exec(remainingText);

      if (!match) {
        chunks.push({
          highlight: false,
          start: lastIndex,
          end: textToHighlight.length,
        });
        break;
      }

      const start = lastIndex + match.index;
      const end = start + match[0].length;

      if (start > lastIndex) {
        chunks.push({ highlight: false, start: lastIndex, end: start });
      }

      chunks.push({ highlight: true, start, end });
      lastIndex = end;

      break; // Only highlight the first occurrence
    }
  });

  if (lastIndex < textToHighlight.length) {
    if (
      chunks[0].start !== lastIndex ||
      chunks[0].end !== textToHighlight.length
    ) {
      chunks.push({
        highlight: false,
        start: lastIndex,
        end: textToHighlight.length,
      });
    }
  }

  return chunks;
};

const Highlighter: React.FC<HighlighterProps> = ({
  autoEscape = false,
  highlightStyle,
  searchWords,
  textToHighlight,
  sanitize,
  style,
  ...props
}) => {
  let decodedTextToHighLight = decodeTaggingRoute({ text: textToHighlight });
  const chunks = findAll({
    textToHighlight: decodedTextToHighLight,
    searchWords,
    sanitize,
    autoEscape,
  });

  return (
    <Text style={style} {...props} numberOfLines={3} ellipsizeMode="tail">
      {chunks.map((chunk, index) => {
        const text = decodedTextToHighLight.substring(chunk.start, chunk.end);

        return !chunk.highlight ? (
          text
        ) : (
          <Text key={index} style={highlightStyle}>
            {text}
          </Text>
        );
      })}
    </Text>
  );
};

export default Highlighter;
