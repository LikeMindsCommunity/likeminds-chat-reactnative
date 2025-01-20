import React from "react"
import HomeFeed from "../screens/HomeFeed/index"
import { Themes } from "../enums/Themes"

export function LMChatCommunityFeedScreenWrapper({ navigation }) {
    return (
        <HomeFeed navigation={navigation} theme={Themes.COMMUNITY} />
    )
}