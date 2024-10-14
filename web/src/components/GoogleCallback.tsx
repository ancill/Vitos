import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "@tanstack/react-router";

export function GoogleCallback() {
  const { handleCallback, isLoading, isError, error } = useAuth();
  const { navigate } = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("token");

    if (code) {
      handleCallback(code, {
        onSuccess: () => {
          navigate({ to: "/about" }); // Redirect to dashboard after successful login
        },
      });
    }
  }, [handleCallback, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  return null;
}
