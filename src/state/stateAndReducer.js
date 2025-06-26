export const initialState = {
  inCall: false,
  isMeetingEnded: false,
  waitingForPeer: false,
  remoteStreams: [],
  offer: [],
  answer: [],
  pinnedClient: null,
  offerAnswerVisibile: true,
};

export const reducerFunction = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_IN_CALL':
      return { ...state, inCall: action.payload };
    case 'SET_IS_MEETING_ENDED':
      return { ...state, isMeetingEnded: action.payload };
    case 'SET_WAITING_FOR_PEER':
      return { ...state, waitingForPeer: action.payload };
    case 'SET_REMOTE_STREAMS':
      return { ...state, remoteStreams: action.payload };
    case 'SET_OFFER':
      return { ...state, offer: action.payload };
    case 'SET_ANSWER':
      return { ...state, answer: action.payload };
    case 'SET_PINNED_CLIENT':
      return { ...state, pinnedClient: action.payload };
    case 'OFFER_ANSWER_VISIBLE':
      return { ...state, offerAnswerVisibile: action.payload };
    default:
      return state;
  }
};
