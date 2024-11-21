import { SyncChatroomRequest } from "@likeminds.community/chat-rn";
import { Client } from "../client";

// Sync Chatrrom API
async function syncChatroomAPI(
  page: number,
  minTimeStamp: number,
  maxTimeStamp: number,
  isDm: boolean
) {
  const chatroomTypes = isDm ? [10] : [0, 7];
  const res = await Client.myClient?.syncChatroom(
    SyncChatroomRequest.builder()
      .setPage(page)
      .setPageSize(50)
      .setChatroomTypes(chatroomTypes)
      .setMaxTimestamp(maxTimeStamp)
      .setMinTimestamp(minTimeStamp)
      .build()
  );
  return res;
}

const INITIAL_SYNC_PAGE = 1;

// Pagination call for sync chatroom
export const paginatedSyncAPI = async (
  page: number,
  user: any,
  isDm: boolean
) => {
  const timeStampStored = await Client.myClient?.getTimeStamp();

  const minTimeStampNow = isDm
    ? timeStampStored[0].minTimeStampDm
    : timeStampStored[0].minTimeStampGroup;

  const maxTimeStampNow = Math.floor(Date.now() / 1000);

  const val: any = await syncChatroomAPI(
    page,
    minTimeStampNow,
    maxTimeStampNow,
    isDm
  );

  const DB_RESPONSE = val?.data;

  if (page === INITIAL_SYNC_PAGE && DB_RESPONSE?.chatroomsData.length !== 0) {
    await Client.myClient?.saveCommunity(
      DB_RESPONSE?.communityMeta[user?.sdkClientInfo?.community]
    );
  }

  if (DB_RESPONSE?.chatroomsData.length !== 0) {
    await Client.myClient?.saveChatroomResponse(
      DB_RESPONSE,
      DB_RESPONSE?.chatroomsData,
      user?.sdkClientInfo?.community
    );
  }
  await Client.myClient.updateTimeStamp(maxTimeStampNow, isDm);

  if (DB_RESPONSE?.chatroomsData?.length === 0) {
    return;
  } else {
    await paginatedSyncAPI(page + 1, user?.sdkClientInfo?.community, isDm);
  }
};
