import React, { Alert, Linking, Platform, Text, TextStyle } from "react-native";
import STYLES from "../constants/Styles";
import {
  DOCUMENT_ICON,
  DOCUMENT_STRING,
  GIF_ICON,
  MULTIPLE_DOCUMENT_STRING,
  MULTIPLE_PHOTO_STRING,
  MULTIPLE_VIDEO_STRING,
  PDF_TEXT,
  PHOTO_ICON,
  PHOTO_STRING,
  VIDEO_ICON,
  VIDEO_STRING,
  VIDEO_TEXT,
  VOICE_NOTE_ICON,
} from "../constants/Strings";
import { createThumbnail } from "react-native-create-thumbnail";
import PdfThumbnail from "react-native-pdf-thumbnail";
import { DocumentType, Events, Keys } from "../enums";
import { LMChatAnalytics } from "../analytics/LMChatAnalytics";
import { getConversationType } from "../utils/analyticsUtils";
import { NavigateToProfileParams } from "../callBacks/type";
import { CallBack } from "../callBacks/callBackClass";
import { MediaAttachment } from "./model";

const REGEX_USER_SPLITTING = /(<<.+?\|route:\/\/[^>]+>>)/gu;
export const REGEX_USER_TAGGING =
  /<<(?<name>[^<>|]+)\|route:\/\/(?<route>[^?]+(\?.+)?)>>/g;

const COPY_REGEX_USER_SPLITTING = /(<<.+?\|route:\/\/[^>]+>>)/gu;
const COPY_REGEX_USER_TAGGING =
  /<<(?<name>[^<>|]+)\|route:\/\/(?<route>[^?]+(\?.+)?)>>/g;

export const SHOW_LIST_REGEX = /[?&]show_list=([^&]+)/;

export const EXTRACT_PATH_FROM_ROUTE_QUERY = /\/([^/].*)/;

{
  /* This is a generic arrow function to remove a specific key.
  The first argument is the name of the key to remove, the second is the object from where you want to remove the key.
  Note that by restructuring it, we generate the curated result, then return it. */
}
export const removeKey = (key: any, { [key]: _, ...rest }) => rest;

// This function helps us to decode time(created_epoch: 1675421848540) into DATE if more than a day else TIME if less than a day.
export function getFullDate(time: any) {
  if (time) {
    const t = new Date(time);
    const today = new Date(Date.now());
    const date = t.getDate();
    const month = t.getMonth() + 1;
    const year = t.getFullYear();

    const todayStr = `${today.getDate()}/${today.getMonth()}/${today.getFullYear()}`;
    const tStr = `${date}/${month}/${year}`;
    if (todayStr === tStr) {
      return `${t.getHours()}:${t.getMinutes()}`;
    } else {
      return tStr;
    }
  } else {
    return;
  }
}

function detectLinks(
  message: string,
  isLongPress?: boolean,
  textStyles?: any,
  linkTextColor?: string
) {
  const regex =
    /((?:https?:\/\/www\.|https?:\/\/|www\.)\w+\.\w{2,}(?:\/\S*)?|\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b)/i;

  const parts = message.split(regex);
  if (parts?.length > 0) {
    return (
      <Text>
        {parts?.map((val: any, index: any) => (
          <Text key={val + index}>
            {/* key should be unique so we are passing `val(abc) + index(number) = abc2` to make it unique */}
            {regex.test(val) ? (
              <Text
                onPress={async () => {
                  if (!isLongPress) {
                    const urlRegex = /(https?:\/\/[^\s]+)/gi;
                    const emailRegex =
                      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
                    const isURL = urlRegex.test(val);
                    const isEmail = emailRegex.test(val);

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
                  style={[
                    {
                      color: STYLES.$COLORS.LIGHT_BLUE,
                      fontSize: STYLES.$FONT_SIZES.MEDIUM,
                      fontFamily: STYLES.$FONT_TYPES.LIGHT,
                    },
                    textStyles ? { ...textStyles } : null,
                    linkTextColor ? { color: linkTextColor } : null,
                  ]}
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

// to get initials of a name
export function getNameInitials(name: string) {
  let initials = "";
  const words = name.split(" ");
  for (let i = 0; i < words?.length && initials?.length < 2; i++) {
    if (words[i]?.length > 0) {
      initials += words[i][0].toUpperCase();
    }
  }
  return initials;
}

interface DecodeProps {
  text: string | undefined;
  enableClick: boolean;
  chatroomName?: string;
  communityId?: string;
  isLongPress?: boolean;
  memberUuid?: string;
  chatroomWithUserUuid?: string;
  chatroomWithUserMemberId?: string;
  textStyles?: any;
  taggingTextColor?: string;
  linkTextColor?: string;
  boldText?: boolean;
}

// naruto: naruto|route://member_profile/88226?member_id=__id__&community_id=__community__>>
// test string = '<<Sanjay kumar 🤖|route://member/1260>> <<Ishaan Jain|route://member/1003>> Hey google.com';
// This decode function helps us to decode tagged messages like the above test string in to readable format.
// This function has two responses: one for Homefeed screen and other is for chat screen(Pressable ones are for chat screen).
// The REGEX_USER_SPLITTING is used to split the text into different parts based on the regex specified and then using a for loop tags are shown differently along with name and route
export const decode = ({
  text,
  enableClick,
  chatroomName,
  communityId,
  isLongPress,
  memberUuid,
  chatroomWithUserUuid,
  chatroomWithUserMemberId,
  textStyles,
  taggingTextColor,
  linkTextColor,
  boldText
}: DecodeProps) => {
  if (!text) {
    return;
  }

  // incase of chatbot disable all regex except for text enclosed within ** ** to be made bold
  if (boldText) {
    return parseBoldText(text);
  }

  const arr: any[] = [];
  const parts = text?.split(REGEX_USER_SPLITTING);

  const lmChatInterface = CallBack.lmChatInterface;
  let taggedUserId = "";

  if (parts) {
    for (const matchResult of parts) {
      if (matchResult.match(REGEX_USER_TAGGING)) {
        const match = REGEX_USER_TAGGING.exec(matchResult);
        if (match !== null) {
          const { name } = match?.groups!;
          let { route } = match?.groups!;

          const startingIndex = route.indexOf("/");
          taggedUserId = route.substring(startingIndex + 1);

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

    const chatroomTopicStyles = STYLES.$CHATROOM_TOPIC_STYLE;
    const topicDescription = chatroomTopicStyles?.topicDescription;

    return enableClick ? (
      <Text>
        {arr.map((val, index) => (
          <Text
            style={[
              {
                color: STYLES.$COLORS.FONT_PRIMARY,
                fontFamily: STYLES.$FONT_TYPES.LIGHT,
              },
              textStyles ? { ...textStyles } : null,
            ]}
            key={val.key + index}
          >
            {/* key should be unique so we are passing `val(abc) + index(number) = abc2` to make it unique */}

            {val.route ? (
              <Text
                onPress={() => {
                  if (!isLongPress) {
                    const params: NavigateToProfileParams = {
                      taggedUserId: taggedUserId,
                      member: null,
                    };
                    lmChatInterface.navigateToProfile(params);
                  }
                }}
                style={[
                  {
                    color: STYLES.$COLORS.LIGHT_BLUE,
                    fontSize: STYLES.$FONT_SIZES.MEDIUM,
                    fontFamily: STYLES.$FONT_TYPES.LIGHT,
                  },
                  textStyles ? { ...textStyles } : null,
                  taggingTextColor ? { color: taggingTextColor } : null,
                ]}
              >
                {val.key}
              </Text>
            ) : (
              detectLinks(val.key, isLongPress, textStyles, linkTextColor)
            )}
          </Text>
        ))}
      </Text>
    ) : (
      <Text>
        {arr.map((val, index) => (
          <Text
            style={
              [
                {
                  color: topicDescription?.color
                    ? topicDescription?.color
                    : STYLES.$COLORS.FONT_PRIMARY,
                },
                {
                  fontFamily: topicDescription?.fontFamily
                    ? topicDescription?.fontFamily
                    : STYLES.$FONT_TYPES.LIGHT,
                },
                {
                  fontSize: topicDescription?.fontSize
                    ? topicDescription?.fontSize
                    : null,
                },
              ] as TextStyle[]
            }
            key={val.key + index}
          >
            {val.route ? (
              <Text
                style={{
                  color: STYLES.$COLORS.FONT_PRIMARY,
                  fontFamily: STYLES.$FONT_TYPES.BOLD,
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

// this function makes return text as bold that are enclosed within ** **
const parseBoldText = (input) => {
  // Regex to match text enclosed between ** (e.g., **bold text**)
  const parts = input.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2); // Remove the ** markers
      return (
        <Text key={index} style={{ fontWeight: 'bold', color: STYLES.$COLORS.FONT_PRIMARY }}>
          {boldText}
        </Text>
      );
    }
    return <Text key={index} style={{ color: STYLES.$COLORS.FONT_PRIMARY}}>{part}</Text>;
  });
};

// this function return a string which have decoded tagging route name in it
export const decodeTaggingRoute = ({
  text,
  memberUuid,
  chatroomWithUserUuid,
  chatroomWithUserMemberId,
}: {
  text: string;
  memberUuid?: string;
  chatroomWithUserUuid?: string;
  chatroomWithUserMemberId?: string;
}) => {
  if (!text) {
    return "";
  }

  const parts = text.split(REGEX_USER_SPLITTING);
  let decodedText = "";

  if (parts) {
    for (const matchResult of parts) {
      if (matchResult.match(REGEX_USER_TAGGING)) {
        const match = REGEX_USER_TAGGING.exec(matchResult);
        if (match !== null) {
          const { name } = match.groups!;
          let { route } = match.groups!;

          const startingIndex = route.indexOf("/");
          const taggedUserId = route.substring(startingIndex + 1);

          if (memberUuid && chatroomWithUserUuid && chatroomWithUserMemberId) {
            const currentMemberId = route.substring(startingIndex + 1);

            if (currentMemberId == chatroomWithUserMemberId) {
              route = `user_profile/${chatroomWithUserUuid}`;
            } else {
              route = `user_profile/${memberUuid}`;
            }
          }

          decodedText += `${name}`;
        }
      } else {
        decodedText += matchResult;
      }
    }
  }

  return decodedText;
};

// this method is used to decode notifications
export const decodeForNotifications = (text: string | undefined) => {
  if (!text) {
    return;
  }
  const arr: any[] = [];
  const parts = text?.split(/(?:<<)?([\w\s🤖@]+\|route:\/\/\S+>>)/g);
  const TEMP_REGEX_USER_TAGGING =
    /(?:<<)?((?<name>[^<>|]+)\|route:\/\/(?<route>[^?]+(\?.+)?)>>)/g;

  if (parts) {
    for (const matchResult of parts) {
      if (matchResult.match(TEMP_REGEX_USER_TAGGING)) {
        const match = TEMP_REGEX_USER_TAGGING.exec(matchResult);
        if (match !== null) {
          const { name, route } = match?.groups!;
          arr.push({ key: name, route: route });
        }
      } else {
        arr.push({ key: matchResult, route: null });
      }
    }
    let decodedText = "";
    for (let i = 0; i < arr.length; i++) {
      decodedText = decodedText + arr[i].key;
    }
    return decodedText;
  } else {
    return text;
  }
};

// This functions formatted the copied messages.
export function decodeStr(text: string | undefined) {
  if (!text) {
    return;
  }

  const arr: any[] = [];
  const parts = text.split(COPY_REGEX_USER_SPLITTING);

  if (parts) {
    for (const matchResult of parts) {
      const match = COPY_REGEX_USER_TAGGING.exec(matchResult);
      if (match && match.groups) {
        const memberName = match.groups.name;
        arr.push({ key: memberName, route: true });
      } else {
        arr.push({ key: matchResult, route: null });
      }
    }

    let str = "";
    arr.forEach((val) => {
      str += val.key;
    });
    return str;
  } else {
    return text;
  }
}

// this function return copied messages in formatted form using decodeStr
export function copySelectedMessages(
  selectedMessages: any,
  chatroomID: string
) {
  LMChatAnalytics.track(
    Events.MESSAGE_COPIED,
    new Map<string, string>([
      [Keys.TYPE, getConversationType(selectedMessages[0])],
      [Keys.CHATROOM_ID, chatroomID],
    ])
  );
  if (selectedMessages?.length === 1 && !selectedMessages[0]?.deletedBy) {
    if (selectedMessages[0]?.answer) {
      return decodeStr(selectedMessages[0]?.answer);
    } else {
      return "";
    }
  } else {
    const copiedMessages = selectedMessages
      .map((message: any) => {
        if (!!message?.answer && !message?.deletedBy) {
          const timestamp = `[${message?.date}, ${message?.createdAt}]`;
          const sender = message?.member?.name;
          const text = decodeStr(message?.answer);
          return `${timestamp} ${sender}: ${text}`;
        } else {
          return "";
        }
      })
      .join("\n");
    return copiedMessages;
  }
}

// this function formats the recordedTime(future) in days hours and minutes
export function formatTime(recordedTime: number): string {
  const date: Date = new Date(recordedTime);
  const now: Date = new Date();

  const diff: number = date.getTime() - now.getTime();
  const seconds: number = Math.floor(diff / 1000);
  const minutes: number = Math.floor(seconds / 60);
  const hours: number = Math.floor(minutes / 60);
  const days: number = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h ${minutes % 60}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else {
    return `${minutes}m`;
  }
}

export function uriToBlob(uri: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // If successful -> return with blob
    xhr.onload = function () {
      resolve(xhr.response);
    };

    // reject on error
    xhr.onerror = function () {
      reject(new Error("uriToBlob failed"));
    };

    // Set the response type to 'blob' - this means the server's response
    // will be accessed as a binary object
    xhr.responseType = "blob";

    // Initialize the request. The third argument set to 'true' denotes
    // that the request is asynchronous
    xhr.open("GET", uri, true);

    // Send the request. The 'null' argument means that no body content is given for the request
    xhr.send(null);
  });
}

// to fetch resource from given uri and create blob out of it
export const fetchResourceFromURI = async (uri: string) => {
  const blob = await uriToBlob(uri);
  return blob;
};

interface VideoThumbnail {
  selectedImages: any;
  selectedFilesToUpload?: any;
  selectedFilesToUploadThumbnails?: any;
  initial: boolean; // true when selecting Videos for first time, else false.
}

// function to get thumbnails from videos
export const getVideoThumbnail = async ({
  selectedImages,
  selectedFilesToUpload,
  selectedFilesToUploadThumbnails,
  initial,
}: VideoThumbnail) => {
  let arr: any = [];
  const dummyArrSelectedFiles: any = selectedImages;
  for (let i = 0; i < selectedImages?.length; i++) {
    const item = selectedImages[i];
    if (item?.type?.split("/")[0] === VIDEO_TEXT) {
      await createThumbnail({
        url: item.uri,
        timeStamp: 10000,
      })
        .then((response) => {
          arr = [...arr, { uri: response.path }];
          dummyArrSelectedFiles[i] = {
            ...dummyArrSelectedFiles[i],
            thumbnailUrl: response.path,
          };
        })
        .catch(() => {});
    } else {
      arr = [...arr, { uri: item.uri }];
    }
  }
  return {
    selectedFilesToUploadThumbnails: initial
      ? arr
      : [...selectedFilesToUploadThumbnails, ...arr],
    selectedFilesToUpload: initial
      ? dummyArrSelectedFiles
      : [...selectedFilesToUpload, ...dummyArrSelectedFiles],
  };
};

// function to get thumbnails of all pdf
export const getAllPdfThumbnail = async (selectedImages: any) => {
  let arr: any = [];
  for (let i = 0; i < selectedImages?.length; i++) {
    const item = selectedImages[i];
    const filePath = item.uri;
    const page = 0;
    if (item?.type?.split("/")[1] === PDF_TEXT) {
      const res = await PdfThumbnail.generate(filePath, page);
      if (res) {
        arr = [...arr, { uri: res?.uri }];
      }
    } else {
      arr = [...arr, { uri: item.uri }];
    }
  }
  return arr;
};

// function to get thumbnails of pdf
export const getPdfThumbnail = async (selectedFile: any) => {
  let arr: any = [];
  const filePath = selectedFile.uri;
  const page = 0;
  if (selectedFile?.type?.split("/")[1] === PDF_TEXT) {
    const res = await PdfThumbnail.generate(filePath, page);
    if (res) {
      arr = [...arr, { uri: res?.uri }];
    }
  } else {
    arr = [...arr, { uri: selectedFile.uri }];
  }
  return arr;
};

//this function detect "@" mentions/tags while typing.
export function detectMentions(input: string) {
  const mentionRegex = /(?:^|\s)@(\w+)/g;
  const matches: string[] = [];
  let match;

  while ((match = mentionRegex.exec(input)) !== null) {
    const endIndex = mentionRegex.lastIndex;
    const nextChar = input.charAt(endIndex);

    if (nextChar !== "@") {
      matches.push(match[1] as any);
    }
  }

  const myArray = input.split(" ");
  const doesExists = myArray.includes("@");

  {
    /* It basically checks that for the below four conditions:
   1. if '@' is at end preceded by a whitespace
   2. if input only contains '@'
   3. if '@' occurs at new line
   4. doesExists checks whether '@' has been typed between two strings
   If any of the above condition is true, it pushes it in the matches list which indicates that member list has to be shown
  */
  }
  if (
    input.endsWith(" @") ||
    input === "@" ||
    input.endsWith("\n@") ||
    (doesExists && !input.endsWith(" "))
  ) {
    matches.push("");
  }

  return matches;
}

// this function replaces the last @mention from the textInput if we have clicked on a tag from suggestion
export function replaceLastMention(
  input: string,
  taggerUserName: string,
  mentionUsername: string,
  UUID: string
) {
  let mentionRegex: RegExp;

  if (taggerUserName === "") {
    mentionRegex = /(?<=^|\s)@(?=\s|$)/g;
  } else {
    mentionRegex = new RegExp(
      `@${taggerUserName}\\b(?!.*@${taggerUserName}\\b)`,
      "gi"
    );
  }
  const replacement = `@[${mentionUsername}](${UUID}) `;
  const replacedString = input?.replace(mentionRegex, replacement);
  return replacedString;
}

export const formatValue = (value: any) => {
  // Check if the value matches the required pattern
  const regex = /<<(\w+)\|.*>>/;
  const match = regex.exec(value);

  if (match && match[1]) {
    const username = match[1];
    return `@${username}`;
  }

  return "";
};

// this function is used to extract path from from route query, i.e routeQuery: `user_profile/skjdnc-lskdnjcs-lkdnsm`, path: `skjdnc-lskdnjcs-lkdnsm`
export function extractPathfromRouteQuery(inputString: string): string | null {
  const match = inputString.match(EXTRACT_PATH_FROM_ROUTE_QUERY);
  if (match && match[1]) {
    return match[1];
  } else {
    return null;
  }
}

// this function formats the date in "DD/MM/YYYY hh:mm" format
export const formatDate = (date: any, time: any) => {
  const inputDate = new Date(time);

  // Extracting date components
  const day = String(inputDate.getDate()).padStart(2, "0");
  const month = String(inputDate.getMonth() + 1).padStart(2, "0");
  const year = inputDate.getFullYear();

  // Extracting time components
  const hours = String(inputDate.getHours()).padStart(2, "0");
  const minutes = String(inputDate.getMinutes()).padStart(2, "0");

  // Formating date and time
  const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}`;
  return formattedDateTime;
};

// this function converts seconds count to mm:ss time format
export function convertSecondsToTime(seconds: number) {
  // Ensure that seconds is a non-negative number
  if (isNaN(seconds) || seconds < 0) {
    return "Invalid input";
  }

  let minutes = String(Math.floor(seconds / 60));
  let remainingSeconds = String(seconds % 60);

  // Add leading zeros if necessary
  minutes = minutes.padStart(2, "0");
  remainingSeconds = remainingSeconds.padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
}

// to check if device version greater than or equal to 13 or not
export const atLeastAndroid13 = (): boolean => {
  return Platform.OS === "android" && Platform.Version >= 33;
};

// to generate gif name
export function generateGifName() {
  const currentDate = new Date();
  const timestamp = currentDate
    .toISOString()
    .replace(/[-T:]/g, "")
    .slice(0, -5); // Remove dashes, colons, and seconds

  return `GIF_${timestamp}`; // You can change the file extension or format as needed
}

// replace gif string message
export const generateGifString = (message: string) => {
  if (!message) {
    return "";
  }
  let originalString: string = message;
  let searchString: string =
    "* This is a gif message. Please update your app *";
  let replacementString: string = "";

  let resultString: string = originalString.replace(
    searchString,
    replacementString
  );

  return resultString?.trim();
};

// to show attachment Notifications
export const getNotificationsMessage = (
  attachments: MediaAttachment[],
  conversation: string | undefined
) => {
  let imageCount = 0;
  let videosCount = 0;
  let pdfCount = 0;
  let voiceNoteCount = 0;
  let gifCount = 0;

  const isConversation = conversation ? true : false;

  for (let i = 0; i < attachments?.length; i++) {
    if (attachments[i].type == DocumentType.IMAGE) {
      imageCount++;
    } else if (attachments[i].type == DocumentType.VIDEO) {
      videosCount++;
    } else if (attachments[i].type == DocumentType.PDF) {
      pdfCount++;
    } else if (attachments[i].type == DocumentType.VOICE_NOTE) {
      voiceNoteCount++;
    } else if (attachments[i].type == DocumentType.GIF_TEXT) {
      gifCount++;
    }
  }

  if (imageCount > 0 && videosCount > 0 && pdfCount > 0) {
    return `${imageCount} ${PHOTO_ICON} ${videosCount} ${VIDEO_ICON} ${pdfCount} ${DOCUMENT_ICON} ${conversation}`;
  } else if (imageCount > 0 && videosCount > 0) {
    return `${imageCount} ${PHOTO_ICON} ${videosCount} ${VIDEO_ICON} ${conversation}`;
  } else if (videosCount > 0 && pdfCount > 0) {
    return `${videosCount} ${VIDEO_ICON} ${pdfCount} ${DOCUMENT_ICON} ${conversation}`;
  } else if (imageCount > 0 && pdfCount > 0) {
    return `${imageCount} ${PHOTO_ICON} ${pdfCount} ${DOCUMENT_ICON} ${conversation}`;
  } else if (pdfCount > 0) {
    const isPdfCountGreaterThanOne = pdfCount > 1;
    return `${isPdfCountGreaterThanOne ? pdfCount : ""} ${DOCUMENT_ICON} ${
      isConversation
        ? "Documents: " + conversation
        : isPdfCountGreaterThanOne
        ? MULTIPLE_DOCUMENT_STRING
        : DOCUMENT_STRING
    }`;
  } else if (videosCount > 0) {
    const isVideoCountGreaterThanOne = videosCount > 1;
    return `${isVideoCountGreaterThanOne ? videosCount : ""} ${VIDEO_ICON} ${
      isConversation
        ? "Videos: " + conversation
        : isVideoCountGreaterThanOne
        ? MULTIPLE_VIDEO_STRING
        : VIDEO_STRING
    }`;
  } else if (imageCount > 0) {
    const isImageCountGreaterThanOne = imageCount > 1;
    return `${isImageCountGreaterThanOne ? imageCount : ""} ${PHOTO_ICON} ${
      isConversation
        ? "Photos: " + conversation
        : isImageCountGreaterThanOne
        ? MULTIPLE_PHOTO_STRING
        : PHOTO_STRING
    }`;
  } else if (voiceNoteCount > 0) {
    return `${VOICE_NOTE_ICON} Voice Note ${conversation}`;
  } else if (gifCount > 0) {
    return `${GIF_ICON} GIF ${conversation}`;
  } else {
    return conversation;
  }
};

// this function return formatted data in DD/MM/YYYY format.
export const formatSearchDate = (date: Date): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to 00:00:00 to compare only the date part

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1); // Set date to yesterday

  // Set the time part of the given date to 00:00:00 to compare only the date part
  const inputDate = new Date(date);
  inputDate.setHours(0, 0, 0, 0);

  if (inputDate.getTime() === today.getTime()) {
    return "Today";
  }

  if (inputDate.getTime() === yesterday.getTime()) {
    return "Yesterday";
  }

  if (inputDate < today) {
    const day = inputDate.getDate().toString().padStart(2, "0");
    const month = (inputDate.getMonth() + 1).toString().padStart(2, "0");
    const year = inputDate.getFullYear();

    return `${day}/${month}/${year}`;
  }

  return "";
};
