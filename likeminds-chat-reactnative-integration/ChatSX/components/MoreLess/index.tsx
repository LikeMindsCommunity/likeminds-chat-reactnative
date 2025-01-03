import { Text } from "react-native";
import React, { useEffect, useState } from "react";
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
  isOtherUserChatbot = false,
}) => {
  const [showMore, setShowMore] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const [isFirstRender , setIsFirstRender] = useState(true)

  const MAX_LINES = 3;

  const handleTextLayout = (event: { nativeEvent: { lines: any[] } }) => {
    if (event.nativeEvent.lines.length > MAX_LINES) {
        setIsTruncated(true); // Determine if truncation is required
    } else if(event.nativeEvent.lines.length < MAX_LINES){
        setIsTruncated(false); 
    }
  };

  useEffect(()=>{
    if (isFirstRender) {
      setIsFirstRender(false)
      return;
    }else{
      setShowMore(false)
      setIsTruncated(false)
    }
  },[text])

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
          boldText: isOtherUserChatbot,
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
