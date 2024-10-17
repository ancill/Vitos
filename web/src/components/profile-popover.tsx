import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { AnimatedGreeting } from "./greeting";

export function ProfilePopover({user}: {user: }) {
  const navigate = useNavigate();
  const username = "John Doe"; // Replace with actual username logic
  const email = "john.doe@example.com"; // Replace with actual email logic

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate({ to: "/" });
  };

  return (
    <div className="flex items-center justify-center">
      <AnimatedGreeting username={username} />
      <Popover>
        <PopoverTrigger asChild>
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarImage
              src="/placeholder.svg?height=64&width=64"
              alt={username}
            />
            <AvatarFallback>
              {username
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">{username}</h4>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
            <div className="pt-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
