import { useAuth } from "@/hooks/useAuth";
import { Button } from "./ui/button";

export function AuthButton() {
  const { login, logout, isLoading } = useAuth();

  if (isLoading) {
    return <button disabled>Loading...</button>;
  }

  if (localStorage.getItem("token")) {
    return <button onClick={logout}>Logout</button>;
  }

  return <Button onClick={() => login()}>Login with Google</Button>;
}
