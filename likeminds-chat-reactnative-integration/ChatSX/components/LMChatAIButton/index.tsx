import React, { useEffect, useLayoutEffect, useState } from "react";
import STYLES from "../../constants/Styles";
import { LMChatButton } from "../../uiComponents/LMChatButton"
import { ConversationState, InitUserWithUuid, LMChatClient, ValidateUser } from "@likeminds.community/chat-rn";
import { getMemberState, initAPI, validateUser } from "../../store/actions/homefeed";
import { pushAPI, token } from "../../notifications";
import { useAppDispatch } from "../../store";
import { Client } from "../../client";
import { useNavigation } from "@react-navigation/native";

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
    textSize = 16,
    backgroundColor = STYLES.$COLORS.PRIMARY,
    borderRadius = 20,
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
    const dispatch = useAppDispatch();
    const navigation = useNavigation();

    const callValidateApi = async (accessToken, refreshToken) => {
        const payload: ValidateUser = {
            accessToken: accessToken,
            refreshToken: refreshToken,
        };
        const validateResponse = await dispatch(validateUser(payload, true));

        if (validateResponse !== undefined && validateResponse !== null) {
            // calling getMemberState API
            await dispatch(getMemberState());
            const appConfig = await Client?.myClient?.getAppConfig();
            if (appConfig === null || appConfig === undefined) {
                navigation.navigate("ChatBotInitiateScreen")
            } else {
                console.log(appConfig);
                navigation.navigate("Chatroom", {
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
            const appConfig = await Client?.myClient?.getAppConfig();
            if (appConfig === undefined || appConfig === null) {
                navigation.navigate("ChatBotInitiateScreen")
            } else {
                navigation.navigate("Chatroom", {
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
            buttonStyle={{
                borderRadius: borderRadius,
                elevation: 6,
                backgroundColor: backgroundColor
            }} text={{
                children: text,
                textStyle: {
                    color: textColor,
                    fontWeight: 'bold',
                    fontSize: textSize,
                    marginHorizontal: 5
                },
            }}
            icon={{
                assetPath: icon ? icon : require("../../assets/images/AIChatBot.png"),
                iconStyle: {
                    height: 30,
                    width: 30
                },
            }}
        />
    )
}