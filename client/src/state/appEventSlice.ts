import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AppEventState {
  inCall: boolean;
  pinnedClient: string | null;
  isMeetingEnded: boolean;
  offerAnswerVisibile: boolean;
  waitingForPeer: boolean;
  hostORClient: "host" | "client" | "";
}

const initialState: AppEventState = {
  inCall: false,
  pinnedClient: null,
  isMeetingEnded: false,
  offerAnswerVisibile: true,
  waitingForPeer: false,
  hostORClient: "",
};

const appEventSlice = createSlice({
  initialState,
  name: "appEvents",
  reducers: {
    updateInCall(state, action: PayloadAction<Pick<AppEventState, "inCall">>) {
      state.inCall = action.payload.inCall;
    },
    updatePinnedClient(
      state,
      action: PayloadAction<Pick<AppEventState, "pinnedClient">>
    ) {
      state.pinnedClient = action.payload.pinnedClient;
    },
    updateMeetingEnded(
      state,
      action: PayloadAction<Pick<AppEventState, "isMeetingEnded">>
    ) {
      state.isMeetingEnded = action.payload.isMeetingEnded;
    },
    updateOfferAnswerVisibile(
      state,
      action: PayloadAction<Pick<AppEventState, "offerAnswerVisibile">>
    ) {
      state.offerAnswerVisibile = action.payload.offerAnswerVisibile;
    },
    updateWaitingForPeer(
      state,
      action: PayloadAction<Pick<AppEventState, "waitingForPeer">>
    ) {
      state.waitingForPeer = action.payload.waitingForPeer;
    },
    updateHostORClient(
      state,
      action: PayloadAction<Pick<AppEventState, "hostORClient">>
    ) {
      state.hostORClient = action.payload.hostORClient;
    },
  },
});

export const {
  updateInCall,
  updateMeetingEnded,
  updateOfferAnswerVisibile,
  updatePinnedClient,
  updateWaitingForPeer,
  updateHostORClient,
} = appEventSlice.actions;

export default appEventSlice.reducer;
