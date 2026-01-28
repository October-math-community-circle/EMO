import { useContext } from "react";
import { FirebaseContext } from "../firebase/context";
export const useUser = () => {
  const { user } = useContext(FirebaseContext);
  return user;
};
