import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { styles } from "../styles";
import CreatePollUI from "../CreatePollUI";
import { CreatePoll } from "../models";
import { CreatePollContextProvider } from "../../../context";

const CreatePollScreen = ({ navigation, route }: CreatePoll) => {
  return (
    <CreatePollContextProvider navigation={navigation} route={route}>
      <CreatePollScreenComponent navigation={navigation} route={route} />
    </CreatePollContextProvider>
  );
};

const CreatePollScreenComponent = ({ navigation, route }: CreatePoll) => {
  const setInitialHeader = () => {
    navigation.setOptions({
      title: "New Poll",
      headerShadowVisible: false,
      headerTitleStyle: [styles.font, styles.newPollText],
      headerStyle: { backgroundColor: styles.lightGreyThumb.color },
      headerLeft: () => (
        <View style={[styles.alignRow, styles.header]}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={styles.viewStyle}
          >
            <Text style={[styles.font]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  };

  // to set header of the component
  useEffect(() => {
    setInitialHeader();
  }, []);

  return <CreatePollUI />;
};

export default CreatePollScreen;
