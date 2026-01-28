"use client";
import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { signin } from "@/app/server-actions/signin";
import { signout } from "@/app/server-actions/signout";
import { auth } from "./";
export const FirebaseContext = createContext<{ user: User | null }>({
  user: null,
});
function Context({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const unSub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await signin(await user.getIdToken());
      } else {
        setUser(null);
        await signout();
      }
    });

    return () => {
      unSub();
    };
  }, []);
  return (
    <FirebaseContext.Provider value={{ user }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export default Context;
