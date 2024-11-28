import { View, Text } from "react-native";
import React, { useState } from "react";
import { styles } from "./styles";
import { decode } from "../../commonFuctions";

const MoreLess = ({
  text,
  enableClick,
  chatroomName,
  communityId,
  textStyles,
  linkTextColor,
  taggingTextColor,
  showMoreTextStyle,
}) => {
  const [showMore, setShowMore] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);

  const MAX_LINES = 3;

  const handleTextLayout = (event: { nativeEvent: { lines: any[] } }) => {
    if (event.nativeEvent.lines.length > MAX_LINES) {
      setIsTruncated(true); // Determine if truncation is required
    }
  };
  return (
    <>
      <Text
        onTextLayout={handleTextLayout}
        numberOfLines={showMore ? undefined : MAX_LINES}
      >
        {decode({
          text: text,
          enableClick: enableClick,
          chatroomName: chatroomName,
          communityId: communityId,
          textStyles: textStyles,
          linkTextColor: linkTextColor,
          taggingTextColor: taggingTextColor,
        })}
      </Text>
      {isTruncated ? (
        <Text
          style={[styles.showMoreText, showMoreTextStyle]}
          onPress={() => setShowMore(!showMore)}
        >
          {showMore ? "Read Less" : "Read More"}
        </Text>
      ) : null}
    </>
  );
};

export default MoreLess;
