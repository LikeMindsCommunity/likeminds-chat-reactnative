import { View, Text, Image, TouchableOpacity, BackHandler, ColorSchemeName, ViewStyle, StyleSheet } from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../store";
import STYLES from "../../constants/Styles";
import LottieView from "../../optionalDependecies/LottieView";
import Layout from "../../constants/Layout";
import { Client } from "../../client";
import { SHOW_LIST_REGEX } from "../../uiComponents/commonFunctions";
import { CHATROOM } from "../../constants/Screens";
import { NavigationProp, StackActions } from "@react-navigation/native";
import { LMChatButton, LMChatTextView } from "../../uiComponents";
import { StackNavigationProp } from "@react-navigation/stack";
import LMChatAIButton from "../../components/LMChatAIButton"
import { SHOW_TOAST } from "../../store/types/types";
import ToastMessage from "../../components/ToastMessage";

interface LMChatAIBotInitiaitionProps {
    navigation: StackNavigationProp<any>;
    route: any;
    animationToShowPath?: Object;
    previewText?: string;
    animationToShowUrl?: string,
    lottieAnimationStyle?: ViewStyle
}

const LMChatAIBotInitiaitionScreen = ({
    navigation,
    route,
    animationToShowUrl,
    animationToShowPath,
    previewText,
    lottieAnimationStyle
}: LMChatAIBotInitiaitionProps) => {
    const dispatch = useAppDispatch();
    const [toast, setToast] = useState(false);
    const [message, setMessage] = useState("");
    const [animationData, setAnimationData] = useState(null);
    const [fetchingAnimationData, setFetchingAnimationData] = useState(true);

    const chatBotInitScreenStyles = STYLES.$CHATBOT_INIT_SCREEN_STYLE;

    useLayoutEffect(() => {
        const fetchAnimation = async () => {
            try {
                setFetchingAnimationData(true);
                const response = await fetch(animationToShowUrl ?
                    animationToShowUrl
                    : 'https://likeminds-configs-prod.s3.ap-south-1.amazonaws.com/sdk-configs/ai-chatbot-initiate-lottie-animation.json');
                const data = await response.json();
                setAnimationData(data);
                setFetchingAnimationData(false);
            } catch (error) {
                console.error('Error fetching Lottie JSON:', error);
                setFetchingAnimationData(false);
            }
        };

        fetchAnimation();
    }, []);

    useLayoutEffect(() => {
        (async () => {
            const response = await Client.myClient?.getAIChatbots(
                {
                    page: 1,
                    pageSize: 10
                }
            );
            if (response?.success == true &&
                response?.data?.totalChatbots > 0 &&
                response?.data?.users?.length > 0) {
                let firstChatbot = (response?.data?.users[0]);
                const DMStatus = await Client.myClient?.checkDMStatus({
                    uuid: firstChatbot?.uuid,
                    requestFrom: "dm_feed_v2"
                });
                if (DMStatus?.success && DMStatus?.data?.cta) {
                    let chatroom_id = "";
                    let CTA = (DMStatus?.data?.cta);
                    const regex = /chatroom_id=(\d+)/;
                    const match = CTA?.match(regex);
                    if (match) {
                        chatroom_id = match[1];
                        const res = await Client?.myClient?.setChatroomIdWithAIChatbot(chatroom_id);
                        navigation.dispatch(
                            StackActions.replace(CHATROOM, { chatroomID: res?.chatroomIdWithAIChatbot })
                        );
                    } else {
                        const DMChatroom = await Client?.myClient?.createDMChatroom({
                            uuid: firstChatbot?.uuid
                        });
                        if (DMChatroom?.success) {
                            console.log(DMChatroom);
                            await Client?.myClient?.initiateAppConfig();
                            const res = await Client?.myClient?.setChatroomIdWithAIChatbot(
                                DMChatroom?.data?.chatroom?.id?.toString()
                            );
                            navigation.dispatch(
                                StackActions.replace(CHATROOM, { chatroomID: res?.chatroomIdWithAIChatbot })
                            );
                        } else {
                            setToast(true);
                            setMessage("Something went wrong while creating chatroom")
                        }
                    }
                } else {
                    setToast(true);
                    setMessage("Something went wrong")
                }
            } else {
                setToast(true);
                setMessage("No AI Chatbots available")
            }
        })()
    }, [])


    return (
        <View style={StyleSheet.flatten([
            { flex: 1, backgroundColor: STYLES.$BACKGROUND_COLORS.LIGHT },
            chatBotInitScreenStyles?.parentViewStyle
        ])}>
            {
                !fetchingAnimationData ?
                    <>
                        <View style={{ flex: 1, justifyContent: "center", alignItems: 'center' }}>
                            <LottieView
                                source={animationToShowPath ? animationToShowPath : animationToShowUrl ? animationToShowUrl : animationData}
                                style={
                                    StyleSheet.flatten([
                                        { height: Layout.normalize(500), width: Layout.normalize(500) },
                                        lottieAnimationStyle
                                    ])
                                }
                                autoPlay
                            />
                            <LMChatTextView textStyle={StyleSheet.flatten([
                                {
                                    fontSize: 20,
                                    bottom: 20
                                },
                                chatBotInitScreenStyles?.previewTextStyle,
                            ])}>
                                {previewText ? previewText : "Setting up AI chatbot..."}
                            </LMChatTextView>
                        </View>
                        <ToastMessage
                            message={message}
                            isToast={toast}
                            onDismiss={() => {
                                setToast(false);
                            }}
                            time={3000}
                        />
                    </> :
                    <></>
            }
        </View>
    )
};

export default LMChatAIBotInitiaitionScreen;
