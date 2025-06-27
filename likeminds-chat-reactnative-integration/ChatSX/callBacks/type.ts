import { Chatroom } from "@likeminds.community/chat-rn-beta/dist/shared/responseModels/Chatroom";
import { Member } from "@likeminds.community/chat-rn-beta/dist/shared/responseModels/Member";

export interface NavigateToProfileParams {
  taggedUserId?: string | null;
  member?: Member | null;
}

export interface NavigateToGroupDetailsParams {
  chatroom: Chatroom;
}
