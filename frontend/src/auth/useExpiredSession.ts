import { useCallback } from "react";
import { useNavigate } from "react-router";
import { authClient } from "../lib/authClient";

// The API said 401: the server no longer knows this person, even if the screen still thinks
// they are signed in. Clear the screen's own idea of the session, then go to the Sign in page.
// Without clearing it, the Sign in page would see a "signed-in" person and send them straight back.
export function useExpiredSession() {
  const navigate = useNavigate();
  return useCallback(async () => {
    await authClient.signOut();
    navigate("/sign-in", { replace: true });
  }, [navigate]);
}
