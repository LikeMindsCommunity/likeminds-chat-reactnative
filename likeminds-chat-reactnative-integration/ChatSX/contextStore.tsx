import React, { Dispatch, ReactNode } from "react";
import { createContext, useContext, useReducer } from "react";
import { rootReducer } from "./store";
import {
  initialState as ChatroomInitialState,
  ChatroomReducerState,
} from "./store/reducers/chatroomReducer";
import {
  HomeFeedReducerState,
  initialState as HomefeedInitialState,
} from "./store/reducers/homefeedReducer";
import {
  ExploreFeedReducerState,
  initialState as ExplorefeedInitialState,
} from "./store/reducers/explorefeedReducer";
import {
  initialState as LoaderInitialState,
  LoaderReducerState,
} from "./store/reducers/loader";
import {
  FileUploadReducerState,
  initialState as UploadInitialInitialState,
} from "./store/reducers/fileUploadReducer";
import { useReducerWithMiddleware } from "./hooks/useReducerWithMiddleware";

// Model consists of all the states
export interface ContextState {
  homefeed: HomeFeedReducerState;
  chatroom: ChatroomReducerState;
  explorefeed: ExploreFeedReducerState;
  loader: LoaderReducerState;
  upload: FileUploadReducerState;
}

interface AppContextProps {
  state: ContextState;
  dispatch: Dispatch<any>;
}

interface ContextProviderProps {
  children?: React.ReactNode;
}

// Create a context for the combined state
const Context = createContext<AppContextProps | undefined>(undefined);

// Create a provider to use in the component tree
export const ContextProvider = ({ children }: ContextProviderProps) => {
  const initialState: ContextState = {
    homefeed: HomefeedInitialState,
    chatroom: ChatroomInitialState,
    explorefeed: ExplorefeedInitialState,
    loader: LoaderInitialState,
    upload: UploadInitialInitialState,
  };

  const [state, dispatch] = useReducerWithMiddleware(
    rootReducer as any,
    initialState
  );

  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
};

// Custom hook to access the combined state and dispatch function
export const useContextState = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error(
      "useCombinedState must be used within a CombinedStateProvider"
    );
  }
  return context;
};
