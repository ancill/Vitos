import { Button } from "./ui/button";
import { useEffect, useState } from "react";

import { useNavigate, useSearch } from "@tanstack/react-router";

import { ProfilePopover } from "./profile-popover";
export function AuthButton() {
  const [isLogged, setIsLogged] = useState(false);
  const navigate = useNavigate();
  const search = useSearch({
    strict: false,
  }) as {
    token: string;
  };

  useEffect(() => {
    if (search?.token) {
      localStorage.setItem("token", search.token);
      setIsLogged(true);
      navigate({ to: "/" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search?.token]);

  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/google`;
  };

  if (isLogged || localStorage.getItem("token")) {
    return <ProfilePopover />;
  }

  return (
    <>
      <Button onClick={handleLogin}>Login with Google</Button>
    </>
  );
}
