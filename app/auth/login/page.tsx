import { Metadata } from "next";
import LoginPage from "./loginClientPage";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to the EGSO",
};
function page() {
  return <LoginPage />;
}

export default page;
