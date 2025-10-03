export interface ClientToServerEvents {
  sendHostOffer: (data: { email: string; offer: string }) => void;
  sendClientAnswer: (data: { email: string; answer: string }) => void;
  sendInvitation: (data: { email: string; offer: string }) => void;
  requestMeetingData: (data: { email: string }) => void;
  clearMeetingData: () => void;
}

export interface ServerToClientEvents {
  offer: (data: { email: string; offer: string }) => void;
  answer: (data: { email: string; answer: string }) => void;
  invitation: (data: { email: string; offer: string }) => void;
  sendMeetingData: (data: { email: string; offer: string }) => void;
}
