import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ActivityIndicator, TextInput, View } from "react-native";
import { Client } from "../client";
import { useRoute } from "@react-navigation/native";
import Layout from "../constants/Layout";
import STYLES from "../constants/Styles";
import { LMSeverity } from "@likeminds.community/chat-js"

interface SearchInChatroomContextProps {
  children?: ReactNode;
}

interface SearchInChatroomContextValues {
  search: string;
  setSearch: (search: string) => void;
  searchedConversations: any[];
  setSearchedConversations: any;
  chatroomId: number | string;
  inputRef: React.RefObject<TextInput>;
  isEmptyResult: boolean;
  isLoading: boolean;
  handleLoadMore: () => void;
  renderFooter: () => React.JSX.Element | null;
}

const SearchInChatroomContext = createContext<
  SearchInChatroomContextValues | undefined
>(undefined);

export const useSearchInChatroomContext = () => {
  const context = useContext(SearchInChatroomContext);
  if (!context) {
    throw new Error(
      "useSearchInChatroomContext must be used within a SearchInChatroomContextProvider"
    );
  }
  return context;
};

export const SearchInChatroomContextProvider = ({
  children,
}: SearchInChatroomContextProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmptyResult, setIsEmptyResult] = useState(false);
  const [page, setPage] = useState(1);
  const [searchedConversations, setSearchedConversations] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const inputRef = useRef<TextInput>(null);
  const page_size = 20;

  const route = useRoute<any>();
  const { chatroomId } = route?.params;

  useEffect(() => {
    const focusTimeout = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 500);

    return () => clearTimeout(focusTimeout);
  }, []);

  const searchConversation = async () => {
    try {
      const payload = {
        chatroomId: chatroomId,
        search: search,
        followStatus: true,
        page: 1,
        pageSize: page_size,
      };
      const response = await Client.myClient.searchConversation(payload);
      const conversations = response?.data?.conversations;
      if (conversations && conversations.length > 0) {
        setIsEmptyResult(false);
        setSearchedConversations(conversations);
      } else if (!search) {
        setSearchedConversations([]);
      } else {
        setSearchedConversations([]);
        setIsEmptyResult(true);
      }
    } catch (error) {
      Client?.myClient?.handleException(
        error,
        error?.stack,
        LMSeverity.INFO
      )
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      if (search || searchedConversations.length > 0) {
        searchConversation();
      }
    }, 500);
    return () => clearTimeout(delay);
  }, [search]);

  const updateData = async (newPage: number) => {
    try {
      const payload = {
        chatroomId: chatroomId,
        search: search,
        followStatus: true,
        page: newPage,
        pageSize: page_size,
      };
      const response = await Client.myClient.searchConversation(payload);
      return response?.data;
    } catch (error) {
      Client?.myClient?.handleException(
        error,
        error?.stack,
        LMSeverity.INFO
      )
    }
  };

  const loadData = async (newPage: number) => {
    setIsLoading(true);
    const res = await updateData(newPage);
    if (res) {
      setSearchedConversations([
        ...searchedConversations,
        ...res.conversations,
      ]);
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (!isLoading) {
      const arr = searchedConversations;
      if (
        arr.length % page_size === 0 &&
        arr.length > 0 &&
        arr.length === page_size * page
      ) {
        const newPage = page + 1;
        loadData(newPage);
        setPage(newPage);
      }
    }
  };

  const renderFooter = () => {
    return isLoading ? (
      <View style={{ paddingVertical: Layout.normalize(20) }}>
        <ActivityIndicator size="large" color={STYLES.$COLORS.SECONDARY} />
      </View>
    ) : null;
  };

  const contextValues: SearchInChatroomContextValues = {
    search,
    setSearch,
    searchedConversations,
    setSearchedConversations,
    chatroomId,
    inputRef,
    isEmptyResult,
    isLoading,
    handleLoadMore,
    renderFooter,
  };

  return (
    <SearchInChatroomContext.Provider value={contextValues}>
      {children}
    </SearchInChatroomContext.Provider>
  );
};
