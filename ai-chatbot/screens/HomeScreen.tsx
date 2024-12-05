import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LMChatAIButton from '@likeminds.community/chat-rn-core/ChatSX/components/LMChatAIButton'
import { Credentials } from '../login/credentials'

const HomeScreen = () => {
    console.log(Credentials.apiKey, Credentials.userUniqueId, Credentials.username)
    return (
        <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{
                fontSize: 20
            }}>
                LikeMinds AI Chatbot
            </Text>
            <View style={{
                position: 'absolute',
                right: 10,
                bottom: 10
            }}>
                <LMChatAIButton
                    apiKey={Credentials.apiKey}
                    userName={Credentials.username}
                    uuid={Credentials.userUniqueId}
                />
            </View>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({})