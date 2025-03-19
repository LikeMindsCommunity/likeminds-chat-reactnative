import React, { useEffect, useLayoutEffect, useState } from "react";
import STYLES from "../../constants/Styles";
import { LMChatButton } from "../../uiComponents/LMChatButton"
import { ConversationState, InitUserWithUuid, LMChatClient, ValidateUser } from "@likeminds.community/chat-rn";
import { getMemberState, initAPI, validateUser } from "../../store/actions/homefeed";
import { pushAPI, token } from "../../notifications";
import { useAppDispatch } from "../../store";
import { Client } from "../../client";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { CHATBOT_INITIATE_SCREEN, CHATROOM } from "../../constants/Screens";
import Layout from "../../constants/Layout";

interface LMChatAIButtonProps {
    text?: string;
    textSize?: number;
    textColor?: string;
    backgroundColor?: string;
    borderRadius?: number;
    icon?: Object;
    iconPlacement?: "start" | "end";
    apiKey: string;
    uuid: string;
    userName: string;
    imageUrl?: string;
    isGuest?: boolean;
    accessToken?: string;
    refreshToken?: string;
    onTap?: () => void;
}

export default function LMChatAIButton({
    text = "AI bot",
    textColor = "white",
    textSize = 18,
    backgroundColor = '#020D42',
    borderRadius = 28,
    icon,
    iconPlacement = "start",
    apiKey,
    uuid,
    userName,
    imageUrl,
    isGuest,
    accessToken,
    refreshToken,
    onTap
}: LMChatAIButtonProps) {
    const [isInitiated, setIsInitiated] = useState(false);
    const LMChatButtonStyles = STYLES?.$LMCHAT_AI_BUTTON_STYLE;
    const dispatch = useAppDispatch();
    const navigation: any = useNavigation();

    const callValidateApi = async (accessToken, refreshToken) => {
        const payload: ValidateUser = {
            accessToken: accessToken,
            refreshToken: refreshToken,
        };
        const validateResponse = await dispatch(validateUser(payload, true));

        if (validateResponse !== undefined && validateResponse !== null) {
            // calling getMemberState API
            await dispatch(getMemberState());
            const logs = await Client?.myClient?.getLogs();
            if (logs?.length) {
                await Client?.myClient?.flushLogs()
            }
            const appConfig = await Client?.myClient?.getAppConfig();
            if (appConfig === null || appConfig === undefined) {
                navigation.navigate(CHATBOT_INITIATE_SCREEN)
            } else {
                navigation.navigate(CHATROOM, {
                    chatroomID: appConfig?.chatroomIdWithAIChatbot
                })
            }
        }
        setIsInitiated(true);
    };

    async function callInitiateAPI() {
        const { accessToken, refreshToken } = await Client?.myClient?.getTokens();
        if (accessToken && refreshToken) {
            callValidateApi(accessToken, refreshToken);
            return;
        }
        const payload: InitUserWithUuid = {
            userName: userName,
            apiKey: apiKey ? apiKey : "",
            uuid: uuid ? uuid : "",
            isGuest: false,
            imageUrl: imageUrl ? imageUrl : "",
        };
        const initiateResponse: any = await dispatch(initAPI(payload));
        if (initiateResponse !== undefined && initiateResponse !== null) {
            // calling getMemberState API
            await dispatch(getMemberState());
            const logs = await Client?.myClient?.getLogs();
            if (logs?.length) {
                await Client?.myClient?.flushLogs()
            }
            const appConfig = await Client?.myClient?.getAppConfig();
            if (appConfig === undefined || appConfig === null) {
                navigation.navigate(CHATBOT_INITIATE_SCREEN)
            } else {
                navigation.navigate(CHATROOM, {
                    chatroomID: appConfig?.chatroomIdWithAIChatbot
                })
            }
        }
    }

    async function AIChatBotButtonPress() {
        if (accessToken && refreshToken) {
            callValidateApi(accessToken, refreshToken);
        } else if (apiKey && userName && uuid) {
            callInitiateAPI();
        }
    }
    return (
        <LMChatButton placement={iconPlacement}
            onTap={() => {
                if (onTap) {
                    onTap();
                }
                AIChatBotButtonPress();
            }}
            buttonStyle={
                StyleSheet.flatten([
                    {
                        borderRadius: borderRadius,
                        elevation: 6,
                        borderWidth: 0,
                        paddingHorizontal: 6,
                        paddingVertical: 10,
                        backgroundColor: backgroundColor
                    },
                    LMChatButtonStyles?.buttonStyle
                ])
            } text={{
                children: text,
                textStyle: StyleSheet.flatten([
                    {
                        color: textColor,
                        fontWeight: 'bold',
                        fontSize: textSize,
                        marginHorizontal: 5
                    },
                    LMChatButtonStyles?.textStyle
                ]),
            }}
            icon={{
                assetPath: icon ? icon : require("../../assets/images/AIChatBot.png"),
                iconStyle: StyleSheet.flatten([
                    {
                        height: Layout.normalize(30),
                        width: Layout.normalize(30),
                    },
                    LMChatButtonStyles?.iconStyle
                ]),
            }}
        />
    )
}