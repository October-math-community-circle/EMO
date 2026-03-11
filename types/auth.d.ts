import { ParsedToken, User as firebaseUser } from "firebase/auth";
import { Timestamp as ClientTimestamp } from "firebase/firestore";
import { Timestamp as ServerTimestamp } from "firebase-admin/firestore";
export interface User extends firebaseUser {
  claims: ParsedToken;
}
export interface Student {
  id?:string
  fullName: string;
  email: string;
  phone: string;
  school: string;
  dob: ClientTimestamp | ServerTimestamp | string;
  createdAt: ClientTimestamp | ServerTimestamp | string;
  type: "student";
}
