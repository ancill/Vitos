import { Button } from "./ui/button";
import { ProfilePopover } from "./profile-popover";
import { useUser } from "../hooks/useUser";

export function AuthButton() {
  const user = useUser();

  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/google`;
  };

  if (user.data?.id) {
    console.log(user);
    return <ProfilePopover />;
  }

  return <Button onClick={handleLogin}>Login with Google</Button>;
}
