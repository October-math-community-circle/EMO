import { Metadata } from "next";
import RegisterClientPage from "./RegisterClientPage";

export const metadata: Metadata = {
  title: "Register",
  description: "Register for the EMF",
};
function page() {
  return <RegisterClientPage />;
}

export default page;
