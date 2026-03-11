import { Timestamp as ClientTimestamp } from "firebase/firestore";
import { Timestamp as ServerTimestamp } from "firebase-admin/firestore";

export interface Registration {
  id: string;
  governorate: string;
  nationalId: string;
  expired: boolean;
  createdAt: ClientTimestamp | ServerTimestamp | string;
  marked: boolean;
  competitionId: string;
  uid: string;
  grade: number;
}
export interface Mark {
  id: string;
  registrationId: string;
  competitionId: string;
  mark: number;
  markedAt: ClientTimestamp | ServerTimestamp | string;
  markedBy: string;
}
