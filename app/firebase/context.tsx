"use client";
import { createContext, useEffect, useState } from "react";
import { onIdTokenChanged } from "firebase/auth";
import { signin } from "@/app/server-actions/signin";
import { signout } from "@/app/server-actions/signout";
import { auth } from "./";
import { User } from "@october-math-community-circle/shared-utitilies/auth";
import { usePathname, useRouter } from "next/navigation";
import isProtectedRoute from "@/lib/utils/isProtectedRoute";
export const FirebaseContext = createContext<{ user: User | null }>({
  user: null,
});
function Context({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    const unSub = onIdTokenChanged(auth, async (user) => {
      console.log({ user });

      if (user) {
        const { claims, token } = await user.getIdTokenResult(true);
        await signin(token);
        setUser({ ...user, claims });
      } else {
        setUser(null);
        await signout();
        if (isProtectedRoute(pathname || window.location.pathname)) {
          console.log("refreshing");
          router.refresh();
        }
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
