import { ParsedToken, User as firebaseUser } from "firebase/auth";
export interface User extends firebaseUser {
  claims: ParsedToken;
}
