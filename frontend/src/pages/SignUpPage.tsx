import { Navigate } from "react-router";
import { SignupForm } from "@/components/signup-form";
import { useAuth } from "../auth/AuthContext";

export function SignUpPage() {
  const auth = useAuth();

  if (auth.status === "signed-in") {
    return <Navigate to="/browse" replace />;
  }

  return (
    <div className="mx-auto w-full max-w-sm py-8">
      <SignupForm />
    </div>
  );
}
