import { Navigate, useLocation, useSearchParams } from "react-router";
import { LoginForm } from "@/components/login-form";
import { useAuth } from "../auth/AuthContext";

function describeProblem(code: string | null): string | null {
  if (code === null) return null;
  if (code === "account_not_linked") {
    return "That Google email already belongs to a password account, so Google cannot sign you in to it. Sign in with your email and password instead.";
  }
  return "Sign-in did not work. Please try again.";
}

export function SignInPage() {
  const auth = useAuth();
  const location = useLocation();
  const [params] = useSearchParams();

  const from =
    typeof location.state === "object" &&
    location.state !== null &&
    "from" in location.state &&
    typeof location.state.from === "string"
      ? location.state.from
      : "/browse";

  if (auth.status === "signed-in") {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="mx-auto w-full max-w-sm py-8">
      <LoginForm problem={describeProblem(params.get("error"))} />
    </div>
  );
}
