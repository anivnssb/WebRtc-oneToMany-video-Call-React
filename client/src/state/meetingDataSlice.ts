import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface meetingDataState {
  offer: string;
  answer: string;
  remoteStreams: MediaStream[];
  email: string;
}
const initialState: meetingDataState = {
  offer: "",
  answer: "",
  remoteStreams: [],
  email: "",
};

const meetingDataSlice = createSlice({
  initialState,
  name: "meetingData",
  reducers: {
    updateOffer(state, action: PayloadAction<Pick<meetingDataState, "offer">>) {
      state.offer = action.payload.offer;
    },
    updateAnswer(
      state,
      action: PayloadAction<Pick<meetingDataState, "answer">>
    ) {
      state.answer = action.payload.answer;
    },
    updateRemoteStreams(
      state,
      action: PayloadAction<Pick<meetingDataState, "remoteStreams">>
    ) {
      state.remoteStreams = action.payload.remoteStreams;
    },
    updateEmail(state, action: PayloadAction<Pick<meetingDataState, "email">>) {
      state.email = action.payload.email;
    },
  },
});

export const { updateAnswer, updateEmail, updateOffer, updateRemoteStreams } =
  meetingDataSlice.actions;

export default meetingDataSlice.reducer;
