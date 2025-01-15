import {GiphyDialog} from '@giphy/react-native-sdk';
import {
  AddFilesView,
  AddMoreFilesView,
  EditBox,
  InputBoxView,
  InputWrapper,
  InputWrapperLeftSection,
  LinkPreviewInputView,
  ReplyBoxView,
  SelectFilesModal,
  SendDMRequestModal,
  TextInputWrapper,
  useInputBoxContext,
  UserTaggingList,
  VoiceNoteRecordToast,
} from '@likeminds.community/chat-rn-core';
import RecordSendInputFabView, {
  OnSendMessageProp,
} from '@likeminds.community/chat-rn-core/ChatSX/components/RecordSendInputFabView';
import {CREATE_POLL_SCREEN} from '@likeminds.community/chat-rn-core/ChatSX/constants/Screens';
import {useAppDispatch} from '@likeminds.community/chat-rn-core/ChatSX/store';
import {
  SELECTED_MESSAGES,
  SET_EDIT_MESSAGE,
  SET_IS_REPLY,
  SET_REPLY_MESSAGE,
} from '@likeminds.community/chat-rn-core/ChatSX/store/types/types';
import {Keyboard, StyleSheet, View} from 'react-native';

const MessageInputBox = () => {
  const {
    hideDMSentAlert,
    message,
    DMSentAlertModalVisible,
    onSend,
    onUserTaggingClicked,
    setShowLinkPreview,
    setClosedOnce,
    setClosedPreview,
    setIsEditable,
    setMessage,
    selectGallery,
    selectDoc,
    handleStopRecord,
    clearVoiceRecord,
    onPausePlay,
    onResumePlay,
    setModalVisible,
    handleModalClose,
    handleCamera,
    handleDoc,
    handleGallery,
    navigation,
    chatroomID,
    conversations,
  } = useInputBoxContext();
  const dispatch = useAppDispatch();

  const onSendMessageProp = ({
    message,
    metaData,
    voiceNote,
    isSendWhileVoiceNoteRecorderPlayerRunning,
  }: OnSendMessageProp) => {
    console.log('onSendMessageProp 1');
    onSend(
      message,
      metaData,
      voiceNote,
      isSendWhileVoiceNoteRecorderPlayerRunning,
    );
    console.log('onSendMessageProp 2');
  };

  return (
    <View>
      <VoiceNoteRecordToast />

      <InputWrapper>
        <InputWrapperLeftSection>
          <UserTaggingList
            onUserTaggingClickedProp={({
              uuid,
              userName,
              communityId,
              mentionUsername,
            }) => {
              console.log('onUserTaggingClicked 1');
              onUserTaggingClicked({
                uuid,
                userName,
                communityId,
                mentionUsername,
              });
              console.log('onUserTaggingClicked 2');
            }}
          />
          <ReplyBoxView
            handleReplyBoxCloseProp={() => {
              console.log('handleReplyBoxCloseProp 1');
              dispatch({type: SET_IS_REPLY, body: {isReply: false}});
              dispatch({
                type: SET_REPLY_MESSAGE,
                body: {replyMessage: ''},
              });
              console.log('handleReplyBoxCloseProp 2');
            }}
          />
          <LinkPreviewInputView
            handleLinkPreviewCloseProp={() => {
              console.log('handleLinkPreviewCloseProp 1');
              setShowLinkPreview(false);
              setClosedOnce(true);
              setClosedPreview(true);
              console.log('handleLinkPreviewCloseProp 2');
            }}
          />
          <EditBox
            handleEditBoxCloseProp={() => {
              console.log('handleEditBoxCloseProp 1');
              setIsEditable(false);
              setMessage('');
              dispatch({
                type: SET_EDIT_MESSAGE,
                body: {
                  editConversation: '',
                },
              });
              dispatch({
                type: SELECTED_MESSAGES,
                body: [],
              });
              console.log('handleEditBoxCloseProp 2');
            }}
          />

          <TextInputWrapper>
            <AddMoreFilesView
              handleGalleryProp={() => {
                console.log('handleGalleryProp 1');
                selectGallery();
                console.log('handleGalleryProp 2');
              }}
              handleDocumentProp={() => {
                console.log('handleDocumentProp 1');
                selectDoc();
                console.log('handleDocumentProp 2');
              }}
            />
            <InputBoxView
              handleStopRecordProp={() => {
                console.log('handleStopRecordProp 1');
                handleStopRecord();
                console.log('handleStopRecordProp 2');
              }}
              clearVoiceRecordProp={() => {
                console.log('clearVoiceRecordProp 1');
                clearVoiceRecord();
                console.log('clearVoiceRecordProp 2');
              }}
              onPausePlayProp={() => {
                console.log('onPausePlayProp 1');
                onPausePlay();
                console.log('onPausePlayProp 2');
              }}
              onResumePlayProp={() => {
                console.log('onResumePlayProp 1');
                onResumePlay();
                console.log('onResumePlayProp 2');
              }}
              handleGifProp={() => {
                console.log('handleGifProp 1');
                GiphyDialog.show();
                console.log('handleGifProp 2');
              }}
            />
            <AddFilesView
              handleFilesViewProp={() => {
                console.log('handleFilesViewProp 1');
                Keyboard.dismiss();
                setModalVisible(true);
                console.log('handleFilesViewProp 2');
              }}
            />
          </TextInputWrapper>
        </InputWrapperLeftSection>

        {/* Send message and send voice notes UI */}
        <RecordSendInputFabView onSendMessageProp={onSendMessageProp} />
      </InputWrapper>

      {/* More features modal like select Images, Docs etc. */}
      <SelectFilesModal
        handleGalleryProp={() => {
          console.log('handleGalleryProp 1');
          handleGallery();
          console.log('handleGalleryProp 2');
        }}
        handleDocumentProp={() => {
          console.log('handleDocumentProp 1');
          handleDoc();
          console.log('handleDocumentProp 2');
        }}
        handleCameraProp={() => {
          console.log('handleCameraProp 1');
          handleCamera();
          console.log('handleCameraProp 2');
        }}
        handlePollProp={() => {
          console.log('handlePollProp 1');
          navigation.navigate(CREATE_POLL_SCREEN, {
            chatroomID: chatroomID,
            conversationsLength: conversations.length * 2,
          });
          console.log('handlePollProp 2');
        }}
        handleModalCloseProp={() => {
          console.log('handleModalCloseProp 1');
          handleModalClose();
          console.log('handleModalCloseProp 2');
        }}
      />
      {/* SEND DM request Modal */}
      <SendDMRequestModal
        hideDMSentAlert={hideDMSentAlert}
        DMSentAlertModalVisible={DMSentAlertModalVisible}
        onSend={onSendMessageProp}
        message={message}
      />
    </View>
  );
};

export default MessageInputBox;
