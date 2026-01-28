import { ForwardRefRenderFunction, forwardRef, useEffect, useRef } from "react";
import { useUser } from "../hooks/useUser";
import { useRouter } from "next/navigation";

function authRedirect(page: ForwardRefRenderFunction<boolean, object>) {
  const ForwardedChild = forwardRef(page);
  return function HOC() {
    const user = useUser();
    const signingRef = useRef<boolean>(false);
    return !user || (user && signingRef.current) ? (
      <ForwardedChild ref={signingRef} />
    ) : (
      <ClientRedirect />
    );
  };
}
function ClientRedirect() {
  const { push } = useRouter();
  useEffect(() => {
    push("/");
  });
  return <></>;
}
export default authRedirect;
