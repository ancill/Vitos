import { Button } from "@/components/ui/button";

import { useUser } from "../hooks/useUser";
import { ProfilePopover } from "./profile-popover";

export function AuthButton() {
  const { data: user, isLoading } = useUser();

  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/login/google`;
  };

  if (isLoading) {
    return <Button disabled>Loading...</Button>;
  }

  if (user?.id) {
    return <ProfilePopover user={user} />;
  }

  return <Button onClick={handleLogin}>Login with Google</Button>;
}
