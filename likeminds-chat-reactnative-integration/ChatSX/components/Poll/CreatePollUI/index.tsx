import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Switch,
} from "react-native";
import React from "react";
import { styles } from "../styles";
import {
  ANONYMOUS_POLL_TEXT,
  DATE_PLACEHOLDER,
  LIVE_RESULT_TEXT,
  OPTION_TEXT,
  PLACEHOLDER_VALUE,
  POST_TITLE,
  SELECT_OPTION,
  USER_CAN_VOTE_FOR,
} from "../../../constants/Strings";
import { Platform } from "react-native";
import ActionAlertModal from "../../../customModals/ActionListModel";
import DateTimePicker from "@react-native-community/datetimepicker";
import { CreatePollProps } from "../models";
import STYLES from "../../../constants/Styles";
import { useCreatePollContext } from "../../../context/CreatePollContext";
import Layout from "../../../constants/Layout";

const CreatePollUI = () => {
  const {
    show,
    date,
    mode,
    userCanVoteForArr,
    optionsArray,
    showAdvancedOption,
    formatedDateTime,
    timeZoneOffsetInMinutes,
    addOptionsEnabled,
    anonymousPollEnabled,
    liveResultsEnabled,
    question,
    isSelectOptionModal,
    userVoteForOptionsArrValue,
    userVoteFor,
    voteAllowedPerUser,
    isActionAlertModalVisible,

    onChange,
    showDatePicker,
    handleShowAdvanceOption,
    hideActionModal,
    hideSelectOptionModal,
    handleAddOptions,
    handleAnonymousPoll,
    handleLiveResults,
    handleInputOptionsChangeFunction,
    addNewOption,
    removeAnOption,
    postPoll,
    handleQuestion,
    handleOnSelect,
    handleOnSelectOption,
    handleOpenActionModal,
    handleOpenOptionModal,
    resetDateTimePicker,
  }: CreatePollProps = useCreatePollContext();

  return (
    <View>
      <ScrollView
        keyboardShouldPersistTaps={"handled"}
        contentContainerStyle={{ paddingBottom: Layout.normalize(10) }}
        bounces={false}
      >
        {/* Poll question */}
        <View style={styles.pollQuestion}>
          <View>
            <Text style={[styles.font]}>Poll question</Text>
          </View>
          <View style={styles.question}>
            <TextInput
              value={question}
              onChangeText={handleQuestion}
              placeholder={PLACEHOLDER_VALUE}
              style={[styles.font, styles.blackColor]}
              placeholderTextColor="#c5c5c5"
              multiline
            />
          </View>
        </View>

        {/* Answers options */}
        <View style={styles.answerOptions}>
          <View style={styles.paddingHorizontal15}>
            <Text style={[styles.font]}>Answer options</Text>
          </View>

          {optionsArray.map((option: any, index: any) => {
            return (
              <View key={index} style={styles.question}>
                <View
                  style={[
                    styles.alignRow,
                    styles.justifySpace,
                    styles.borderBottom,
                    styles.paddingHorizontal15,
                  ]}
                >
                  <TextInput
                    value={option?.text}
                    placeholder={OPTION_TEXT}
                    style={[
                      styles.font,
                      styles.option,
                      styles.blackColor,
                      { flex: 1 },
                    ]}
                    placeholderTextColor="#c5c5c5"
                    onChangeText={(e: any) => {
                      handleInputOptionsChangeFunction(index, e);
                    }}
                  />
                  {index > 1 ? (
                    <TouchableOpacity
                      onPress={() => {
                        removeAnOption(index);
                      }}
                    >
                      <Image
                        style={[
                          styles.pollIcon,
                          { tintColor: styles.blackColor.color },
                        ]}
                        source={require("../../../assets/images/cross_icon3x.png")}
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            );
          })}

          <TouchableOpacity
            onPress={addNewOption}
            style={[
              styles.alignRow,
              styles.marginSpace,
              styles.paddingHorizontal15,
            ]}
          >
            <Image
              style={[styles.optionIcon]}
              source={require("../../../assets/images/add_options3x.png")}
            />
            <Text style={[styles.text, styles.addOptionText]}>
              Add an option...
            </Text>
          </TouchableOpacity>
        </View>

        {/* Poll expire Time and Date selection */}
        <View style={[styles.answerOptions, styles.paddingHorizontal15]}>
          <View>
            <Text style={[styles.font]}>Poll expires on</Text>
          </View>
          <View style={styles.question}>
            <TouchableOpacity
              onPress={() => {
                showDatePicker();
              }}
            >
              <View
                style={[
                  styles.alignRow,
                  styles.justifySpace,
                  { marginBottom: Layout.normalize(10) },
                ]}
              >
                <Text
                  style={[
                    styles.font,
                    formatedDateTime ? styles.blackColor : styles.placeHolder,
                  ]}
                >
                  {formatedDateTime ? formatedDateTime : DATE_PLACEHOLDER}
                </Text>
                {formatedDateTime ? (
                  <TouchableOpacity
                    onPress={() => {
                      resetDateTimePicker();
                    }}
                  >
                    <Image
                      style={[
                        styles.pollIcon,
                        { tintColor: styles.blackColor.color },
                      ]}
                      source={require("../../../assets/images/cross_icon3x.png")}
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
              {/* Date Time Picker */}
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  timeZoneOffsetInMinutes={timeZoneOffsetInMinutes}
                  value={date ? date : new Date()}
                  mode={Platform.OS === "ios" ? "datetime" : mode}
                  is24Hour={true}
                  display="default"
                  onChange={onChange}
                  minimumDate={mode === "date" ? new Date() : undefined}
                  accentColor={STYLES.$COLORS.PRIMARY}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Advance options toggle button */}
        <TouchableOpacity
          style={[
            styles.extraMarginSpace,
            styles.alignRow,
            styles.justifyCenter,
            styles.gap,
          ]}
          onPress={() => {
            handleShowAdvanceOption();
          }}
        >
          <Text
            style={[
              styles.font,
              styles.lightGreyBackground,
              styles.textAlignCenter,
            ]}
          >
            ADVANCED
          </Text>
          <Image
            style={styles.downArrow}
            source={
              !showAdvancedOption
                ? require("../../../assets/images/expand_arrow3x.png")
                : require("../../../assets/images/minimize_arrow3x.png")
            }
          />
        </TouchableOpacity>

        {/* Advance options*/}
        {showAdvancedOption ? (
          <View style={[styles.advancedOptions]}>
            <View
              style={[
                styles.alignRow,
                styles.justifySpace,
                styles.paddingVertical10,
                styles.borderBottom,
                styles.paddingHorizontal15,
              ]}
            >
              <Text style={[styles.font, styles.blackColor]}>
                Allow voters to add the option
              </Text>
              <Switch
                trackColor={{
                  false: styles.lightGreyBackground.color,
                  true: styles.primaryColor.color,
                }}
                thumbColor={
                  addOptionsEnabled ? "fff" : styles.lightGreyThumb.color
                }
                ios_backgroundColor={styles.lightGreyBackground.color}
                onValueChange={handleAddOptions}
                value={addOptionsEnabled}
              />
            </View>
            <View
              style={[
                styles.alignRow,
                styles.justifySpace,
                styles.paddingVertical10,
                styles.borderBottom,
                styles.paddingHorizontal15,
              ]}
            >
              <Text style={[styles.font, styles.blackColor]}>
                {ANONYMOUS_POLL_TEXT}
              </Text>
              <Switch
                trackColor={{
                  false: styles.lightGreyBackground.color,
                  true: styles.primaryColor.color,
                }}
                thumbColor={
                  anonymousPollEnabled ? "fff" : styles.lightGreyThumb.color
                }
                ios_backgroundColor={styles.lightGreyBackground.color}
                onValueChange={handleAnonymousPoll}
                value={anonymousPollEnabled}
              />
            </View>
            <View
              style={[
                styles.alignRow,
                styles.justifySpace,
                styles.paddingVertical10,
                styles.borderBottom,
                styles.paddingHorizontal15,
              ]}
            >
              <Text style={[styles.font, styles.blackColor]}>
                {LIVE_RESULT_TEXT}
              </Text>
              <Switch
                trackColor={{
                  false: styles.lightGreyBackground.color,
                  true: styles.primaryColor.color,
                }}
                thumbColor={
                  liveResultsEnabled ? "fff" : styles.lightGreyThumb.color
                }
                ios_backgroundColor={styles.lightGreyBackground.color}
                onValueChange={handleLiveResults}
                value={liveResultsEnabled}
              />
            </View>
            <View style={[styles.paddingHorizontal15, styles.paddingVertical5]}>
              <View
                style={[
                  styles.alignRow,
                  styles.justifySpace,
                  styles.marginSpace,
                ]}
              >
                <Text style={[styles.smallText, styles.greyColor]}>
                  {USER_CAN_VOTE_FOR}
                </Text>
              </View>
              <View
                style={[
                  styles.alignRow,
                  styles.justifySpace,
                  styles.marginSpace,
                ]}
              >
                <TouchableOpacity
                  onPress={() => {
                    handleOpenActionModal();
                  }}
                  style={[
                    { flexGrow: 1 },
                    styles.alignRow,
                    styles.justifySpace,
                    { marginRight: Layout.normalize(30) },
                  ]}
                >
                  <Text style={[styles.text, styles.blackColor]}>
                    {userCanVoteForArr[userVoteFor]}
                  </Text>
                  <Image
                    style={styles.pollIcon}
                    source={require("../../../assets/images/sort_down3x.png")}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    handleOpenOptionModal();
                  }}
                  style={[
                    styles.alignRow,
                    styles.justifySpace,
                    { flexGrow: 1 },
                  ]}
                >
                  <Text style={[styles.text, styles.blackColor]}>
                    {!voteAllowedPerUser
                      ? SELECT_OPTION
                      : `${
                          voteAllowedPerUser > 1
                            ? `${voteAllowedPerUser} options`
                            : `${voteAllowedPerUser} option`
                        }`}
                  </Text>
                  <Image
                    style={styles.pollIcon}
                    source={require("../../../assets/images/sort_down3x.png")}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : null}

        {/* Post button */}
        <TouchableOpacity
          onPress={() => {
            postPoll();
          }}
          style={[styles.extraMarginSpace, styles.postButton]}
        >
          <Text style={[styles.font, styles.whiteColor]}>{POST_TITLE}</Text>
        </TouchableOpacity>

        {/* User can vote for option Modal */}
        <ActionAlertModal
          hideActionModal={hideActionModal}
          actionAlertModalVisible={isActionAlertModalVisible}
          optionsList={userVoteForOptionsArrValue}
          onSelect={handleOnSelect}
        />

        {/* option count Modal */}
        <ActionAlertModal
          hideActionModal={hideSelectOptionModal}
          actionAlertModalVisible={isSelectOptionModal}
          optionsList={userVoteForOptionsArrValue}
          onSelect={handleOnSelectOption}
        />
      </ScrollView>
    </View>
  );
};

export default CreatePollUI;
