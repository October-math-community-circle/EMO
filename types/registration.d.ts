import { Timestamp as ClientTimestamp } from "firebase/firestore";
import { Timestamp as ServerTimestamp } from "firebase-admin/firestore";

export interface Registration {
  id: string;
  governorate: string;
  nationalId: string;
  expired: boolean;
  createdAt: ClientTimestamp | ServerTimestamp | string;
  mark: number;
  marked: boolean;
}
