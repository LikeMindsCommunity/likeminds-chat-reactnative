import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {STYLES, useMessageContext} from '@likeminds.community/chat-rn-core';
import {styles} from './styles';

export function ReactionList() {
  const {item, isIncluded, reactionArr, isTypeSent, handleLongPress} =
    useMessageContext();

  const reactionListStyles = STYLES.$REACTION_LIST_STYLE;

  //styling props
  const reactionSize = reactionListStyles?.reactionSize;
  const reactionLeftItemStroke = reactionListStyles?.reactionLeftItemStroke;
  const reactionRightItemStroke = reactionListStyles?.reactionRightItemStroke;
  const reactionItemBorderRadius = reactionListStyles?.reactionItemBorderRadius;
  const gap = reactionListStyles?.gap;
  const selectedMessageBackgroundColor =
    reactionListStyles?.selectedMessageBackgroundColor;

  const SELECTED_BACKGROUND_COLOR = selectedMessageBackgroundColor
    ? selectedMessageBackgroundColor
    : STYLES.$COLORS.SELECTED_BLUE;

  const reactionLen = reactionArr.length;

  return (
    <View>
      {!item?.deletedBy ? (
        reactionLen > 0 && reactionLen <= 2 ? (
          <View
            style={[
              isTypeSent
                ? styles.reactionSentParent
                : styles.reactionReceivedParent,
            ]}>
            {reactionArr.map((val: any, index: any) => (
              <TouchableOpacity
                onLongPress={handleLongPress}
                delayLongPress={200}
                style={[
                  styles.reaction,
                  reactionSize
                    ? {width: reactionSize, height: reactionSize}
                    : null,
                  isTypeSent && reactionRightItemStroke
                    ? {backgroundColor: reactionRightItemStroke}
                    : null,
                  !isTypeSent && reactionLeftItemStroke
                    ? {backgroundColor: reactionLeftItemStroke}
                    : null,
                  reactionItemBorderRadius
                    ? {
                        borderRadius: reactionItemBorderRadius,
                      }
                    : null,
                  gap ? {gap: gap} : null,

                  isIncluded
                    ? {backgroundColor: SELECTED_BACKGROUND_COLOR}
                    : null,
                ]}
                key={val + index}>
                <Text style={styles.messageText}>{val?.memberArr?.length}</Text>
                <Text style={styles.messageText}>{val?.reaction}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : reactionLen > 2 ? (
          <View
            style={
              isTypeSent
                ? styles.reactionSentParent
                : styles.reactionReceivedParent
            }>
            <TouchableOpacity
              onLongPress={handleLongPress}
              delayLongPress={200}
              style={[
                styles.reaction,
                reactionItemBorderRadius
                  ? {borderRadius: reactionItemBorderRadius}
                  : null,
                isIncluded
                  ? {backgroundColor: SELECTED_BACKGROUND_COLOR}
                  : !isTypeSent && reactionLeftItemStroke
                  ? {backgroundColor: reactionLeftItemStroke}
                  : isTypeSent && reactionRightItemStroke
                  ? {backgroundColor: reactionRightItemStroke}
                  : {backgroundColor: STYLES.$COLORS.TERTIARY},
              ]}>
              <Text style={styles.messageText}>
                {reactionArr[0]?.memberArr?.length}
              </Text>
              <Text style={styles.messageText}>{reactionArr[0]?.reaction}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onLongPress={handleLongPress}
              delayLongPress={200}
              style={[
                styles.reaction,
                reactionItemBorderRadius
                  ? {borderRadius: reactionItemBorderRadius}
                  : null,
                isIncluded
                  ? {backgroundColor: SELECTED_BACKGROUND_COLOR}
                  : !isTypeSent && reactionLeftItemStroke
                  ? {backgroundColor: reactionLeftItemStroke}
                  : isTypeSent && reactionRightItemStroke
                  ? {backgroundColor: reactionRightItemStroke}
                  : {backgroundColor: STYLES.$COLORS.TERTIARY},
              ]}>
              <Text style={styles.messageText}>
                {reactionArr[1]?.memberArr?.length}
              </Text>
              <Text style={styles.messageText}>{reactionArr[1]?.reaction}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onLongPress={handleLongPress}
              delayLongPress={200}
              style={[
                styles.moreReaction,
                reactionItemBorderRadius
                  ? {borderRadius: reactionItemBorderRadius}
                  : null,
                isIncluded
                  ? {backgroundColor: SELECTED_BACKGROUND_COLOR}
                  : !isTypeSent && reactionLeftItemStroke
                  ? {backgroundColor: reactionLeftItemStroke}
                  : isTypeSent && reactionRightItemStroke
                  ? {backgroundColor: reactionRightItemStroke}
                  : {backgroundColor: STYLES.$COLORS.TERTIARY},
              ]}></TouchableOpacity>
          </View>
        ) : null
      ) : null}
    </View>
  );
}
