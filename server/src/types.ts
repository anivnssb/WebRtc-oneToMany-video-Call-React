export interface ClientToServerEvents {
  sendHostOffer: (data: { room: string; offer: string }) => void;
  sendClientAnswer: (data: { room: string; answer: string }) => void;
  sendInvitation: (data: { room: string; offer: string }) => void;
}

export interface ServerToClientEvents {
  offer: (data: { room: string; offer: string }) => void;
  answer: (data: { room: string; answer: string }) => void;
  invitation: (data: { room: string; offer: string }) => void;
}
