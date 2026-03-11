import { Timestamp as ClientTimestamp } from "firebase/firestore";
import { Timestamp as ServerTimestamp } from "firebase-admin/firestore";

export type CompetitionStatus =
  | "draft"
  | "open"
  | "in_progress"
  | "completed"
  | "closed"
  | "cancelled";

export interface Competition {
  id?: string;
  title: string;
  description: string;
  location: "Online" | string;
  maxParticipants?: number;
  status: CompetitionStatus;
  startDate: ClientTimestamp | ServerTimestamp | string;
  endDate: ClientTimestamp | ServerTimestamp | string;
  createdAt: ClientTimestamp | ServerTimestamp | string;
  createdBy: string;
}
