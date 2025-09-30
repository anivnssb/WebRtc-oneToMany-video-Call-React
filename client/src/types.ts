export interface ClientToServerEvents {
  sendHostOffer: (data: { email: string; offer: string }) => void;
  sendClientAnswer: (data: { email: string; answer: string }) => void;
  sendInvitation: (data: { emails: string[] }) => void;
}

export interface ServerToClientEvents {
  offer: (data: { email: string; offer: string }) => void;
  answer: (data: { email: string; answer: string }) => void;
  invitation: (data: { emails: string[] }) => void;
}
