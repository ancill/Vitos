import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

import type { User } from "../types";
import { AnimatedGreeting } from "./greeting";

interface ProfilePopoverProps {
  user: User;
}

export function ProfilePopover({ user }: ProfilePopoverProps) {
  const username = user.name ?? "John Doe";
  const email = user.email;

  const handleLogout = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/logout`;
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
