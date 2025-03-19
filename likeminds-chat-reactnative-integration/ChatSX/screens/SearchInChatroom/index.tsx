import React, { ReactNode } from "react";
import { Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SearchInChatroomContextProvider } from "../../context/SearchInChatroomContext";
import SearchHeader from "../../components/SearchHeader";
import SearchList from "../../components/SearchList";

interface SearchInChatroomProps {
  customSearchHeader?: () => React.ReactNode;
}

const SearchInChatroom = ({ customSearchHeader }: SearchInChatroomProps) => {
  return (
    <SearchInChatroomContextProvider>
      <SearchInChatroomComponent customSearchHeader={customSearchHeader} />
    </SearchInChatroomContextProvider>
  );
};

export default SearchInChatroom;

const SearchInChatroomComponent = ({
  customSearchHeader,
}: SearchInChatroomProps) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#f8f8f8",
        marginTop: Platform.OS === "ios" ? -10 : 0,
      }}
    >
      {customSearchHeader ? customSearchHeader() : <SearchHeader />}
      <SearchList />
    </SafeAreaView>
  );
};
