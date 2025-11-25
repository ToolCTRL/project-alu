import { ActionFunction, redirect } from "react-router";
import ServerError from "~/components/ui/errors/ServerError";
import { getAuthenticator } from "~/utils/auth/auth.server";

export const loader = () => redirect("/login");

export const action: ActionFunction = ({ request }) => {
  return getAuthenticator(request).authenticate("google", request);
};

export function ErrorBoundary() {
  return <ServerError />;
}
