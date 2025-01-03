import Styles from "../constants/Styles";
import React, {
  Alert,
  Text,
  Linking,
  StyleProp,
  TextStyle,
} from "react-native";
import defaultStyles from "../constants/defaultStyles";
import { LINK_PREVIEW_REGEX } from "../../constants/Regex";

const REGEX_USER_SPLITTING = /(<<.+?\|route:\/\/[^>]+>>)/gu;
export const REGEX_USER_TAGGING =
  /<<(?<name>[^<>|]+)\|route:\/\/(?<route>[^?]+(\?.+)?)>>/g;

export const SHOW_LIST_REGEX = /[?&]show_list=([^&]+)/;

export const EXTRACT_PATH_FROM_ROUTE_QUERY = /\/([^/].*)/;

function detectLinks(message: string, isLongPress?: boolean) {
  
  let parts = message.split(LINK_PREVIEW_REGEX);
  let i = 0;
  if (parts?.length > 0) {
    return (
      <Text>
        {parts?.map((val: any, index: any) => (
          <Text key={val + index}>
            {/* key should be unique so we are passing `val(abc) + index(number) = abc2` to make it unique */}
            {LINK_PREVIEW_REGEX.test(val) ? (
              <Text
                onPress={async () => {
                  if (!!!isLongPress) {
                    const urlRegex = /(https?:\/\/[^\s]+)/gi;
                    const emailRegex =
                      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
                    let isURL = urlRegex.test(val);
                    let isEmail = emailRegex.test(val);

                    if (isEmail) {
                      await Linking.openURL(`mailto:${val}`);
                    } else if (isURL) {
                      await Linking.openURL(val);
                    } else {
                      await Linking.openURL(`https://${val}`);
                    }
                  }
                }}
              >
                <Text
                  style={{
                    color: Styles.$COLORS.LIGHT_BLUE,
                    fontSize: Styles.$FONT_SIZES.MEDIUM,
                    fontFamily: Styles.$FONT_TYPES.LIGHT,
                  }}
                >
                  {val}
                </Text>
              </Text>
            ) : (
              <Text>{val}</Text>
            )}
          </Text>
        ))}
      </Text>
    );
  } else {
    return message;
  }
}

// naruto: naruto|route://member_profile/88226?member_id=__id__&community_id=__community__>>
// test string = '<<Sanjay kumar 🤖|route://member/1260>> <<Ishaan Jain|route://member/1003>> Hey google.com';
// This decode function helps us to decode tagged messages like the above test string in to readable format.
// This function has two responses: one for Homefeed screen and other is for chat screen(Pressable ones are for chat screen).
// The REGEX_USER_SPLITTING is used to split the text into different parts based on the regex specified and then using a for loop tags are shown differently along with name and route
export const decode = (
  text: string | undefined,
  enableClick: boolean,
  plainTextStyle?: StyleProp<TextStyle>,
  chatroomName?: string,
  communityId?: string,
  isLongPress?: boolean,
  memberUuid?: string,
  chatroomWithUserUuid?: string,
  chatroomWithUserMemberId?: string
) => {
  if (!text) {
    return;
  }
  let arr: any[] = [];
  let parts = text?.split(REGEX_USER_SPLITTING);

  if (!!parts) {
    for (const matchResult of parts) {
      if (!!matchResult.match(REGEX_USER_TAGGING)) {
        let match = REGEX_USER_TAGGING.exec(matchResult);
        if (match !== null) {
          let { name, route } = match?.groups!;

          const startingIndex = route.indexOf("/");
          const taggedUserId = route.substring(startingIndex + 1);

          if (memberUuid && chatroomWithUserUuid && chatroomWithUserMemberId) {
            const startingIndex = route.indexOf("/");

            const currentMemberId = route.substring(startingIndex + 1);

            if (currentMemberId == chatroomWithUserMemberId) {
              route = `user_profile/${chatroomWithUserUuid}`;
            } else {
              route = `user_profile/${memberUuid}`;
            }
          }

          arr.push({ key: name, route: route });
        }
      } else {
        arr.push({ key: matchResult, route: null });
      }
    }

    return enableClick ? (
      <Text>
        {arr.map((val, index) => (
          <Text
            style={
              plainTextStyle ? plainTextStyle : defaultStyles.nonPartTextStyle
            }
            key={val.key + index}
          >
            {/* key should be unique so we are passing `val(abc) + index(number) = abc2` to make it unique */}

            {!!val.route ? (
              <Text
                onPress={() => {
                  if (!!!isLongPress) {
                    Alert.alert(`navigate to the route ${val?.route}`);
                  }
                }}
                style={{
                  color: Styles.$COLORS.LIGHT_BLUE,
                  fontSize: Styles.$FONT_SIZES.MEDIUM,
                  fontFamily: Styles.$FONT_TYPES.LIGHT,
                }}
              >
                {val.key}
              </Text>
            ) : (
              detectLinks(val.key, isLongPress)
            )}
          </Text>
        ))}
      </Text>
    ) : (
      <Text>
        {arr.map((val, index) => (
          <Text
            style={{
              color: Styles.$COLORS.PRIMARY,
              fontFamily: Styles.$FONT_TYPES.LIGHT,
            }}
            key={val.key + index}
          >
            {!!val.route ? (
              <Text
                style={{
                  color: Styles.$COLORS.PRIMARY,
                  fontFamily: Styles.$FONT_TYPES.BOLD,
                }}
              >
                {val.key}
              </Text>
            ) : (
              val.key
            )}
          </Text>
        ))}
      </Text>
    );
  } else {
    return text;
  }
};
