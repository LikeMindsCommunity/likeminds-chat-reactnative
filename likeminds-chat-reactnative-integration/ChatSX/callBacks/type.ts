import { Member } from "@likeminds.community/chat-js-beta/dist/pages/user";

export interface NavigateToProfileParams {
  taggedUserId?: string | null;
  member?: Member | null;
}
