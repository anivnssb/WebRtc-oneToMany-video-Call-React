export const initialState = {
  inCall: false,
  peerConnection: [],
  waitingForPeer: false,
  remoteStreams: [],
  offer: [],
  answer: [],
  pinnedClient: null,
};

export const reducerFunction = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_IN_CALL':
      return { ...state, inCall: action.payload };
    case 'SET_PEER_CONNECTION':
      return { ...state, peerConnection: action.payload };
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
    default:
      return state;
  }
};
