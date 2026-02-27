import { Timestamp as ClientTimestamp } from "firebase/firestore";
import { Timestamp as ServerTimestamp } from "firebase-admin/firestore";

export type CompetitionStatus =
  | "draft"
  | "open"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface Competition {
  id?: string;
  title: string;
  description: string;
  location?: string;
  isOnline: boolean;
  maxParticipants?: number;
  status: CompetitionStatus;
  createdAt: ClientTimestamp | ServerTimestamp | string;
  createdBy: string;
}
