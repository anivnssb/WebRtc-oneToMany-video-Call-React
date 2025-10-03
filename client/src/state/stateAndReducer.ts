interface InitialStateInterface {
  inCall: boolean;
  isMeetingEnded: boolean;
  waitingForPeer: boolean;
  remoteStreams: MediaStream[];
  offer: string;
  answer: string;
  pinnedClient: string | null;
  offerAnswerVisibile: boolean;
  email: string;
  offerReceivedFromHost: string;
}
export const initialState = {
  inCall: false,
  offer: "",
  answer: "",
  remoteStreams: [],
  pinnedClient: null,
  isMeetingEnded: false,
  waitingForPeer: false,
  offerAnswerVisibile: true,
  email: "",
  offerReceivedFromHost: "",
};

export const reducerFunction = (
  state: InitialStateInterface,
  action: { payload: any; type: string }
) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_IN_CALL":
      return { ...state, inCall: action.payload };
    case "SET_IS_MEETING_ENDED":
      return { ...state, isMeetingEnded: action.payload };
    case "SET_WAITING_FOR_PEER":
      return { ...state, waitingForPeer: action.payload };
    case "SET_REMOTE_STREAMS":
      return { ...state, remoteStreams: action.payload };
    case "SET_OFFER":
      return { ...state, offer: action.payload };
    case "SET_ANSWER":
      return { ...state, answer: action.payload };
    case "SET_PINNED_CLIENT":
      return { ...state, pinnedClient: action.payload };
    case "OFFER_ANSWER_VISIBLE":
      return { ...state, offerAnswerVisibile: action.payload };
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_OFFER_RECEIVED_FROM_HOST":
      return { ...state, offerReceivedFromHost: action.payload };
    default:
      return state;
  }
};
