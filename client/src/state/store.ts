import { configureStore } from "@reduxjs/toolkit";
import appEventReducer from "./appEventSlice";
import meetingDataReducer from "./meetingDataSlice";

export const store = configureStore({
  reducer: {
    appEvents: appEventReducer,
    meetingData: meetingDataReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
