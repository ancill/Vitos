import { Button } from "./ui/button";
import { useEffect, useState } from "react";

import { useNavigate, useSearch } from "@tanstack/react-router";
export function AuthButton() {
  const [isLogged, setIsLogged] = useState(false);
  const navigate = useNavigate();
  const search = useSearch({
    strict: false,
  }) as {
    token: string;
  };

  console.log(search);
  useEffect(() => {
    if (search?.token) {
      localStorage.setItem("token", search.token);
      setIsLogged(true);
      navigate({ to: "/" });
    }
  }, [search?.token]);

  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/google`;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLogged(false);
    navigate({ to: "/" });
  };

  if (isLogged || localStorage.getItem("token")) {
    return <Button onClick={handleLogout}>Logout</Button>;
  }

  return (
    <>
      <Button onClick={handleLogin}>Login with Google</Button>
    </>
  );
}
