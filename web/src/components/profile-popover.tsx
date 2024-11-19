import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

import { AnimatedGreeting } from "./greeting";
import { useUser } from "@/hooks/useUser";

export function ProfilePopover() {
  const { data } = useUser();
  const username = data?.name ?? "John Doe";
  const email = data?.email;

  const handleLogout = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/logout`;
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
        <PopoverContent className="w-80 bg-white p-4 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
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
