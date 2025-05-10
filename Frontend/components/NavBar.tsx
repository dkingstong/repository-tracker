import { Button } from "./ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Github, RefreshCw, User } from "lucide-react";
import { User as UserType } from "../app/tracker/page";

interface NavbarProps {
  user: UserType | null;
  onSync: () => void;
}

const Navbar = ({ user, onSync }: NavbarProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center gap-2 mr-4">
          <Github className="h-5 w-5 text-primary" />
          <span className="font-semibold">Release Tracker</span>
        </div>
        <div className="flex-1"></div>
        {user && (
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-3 hover:bg-primary/10"
              onClick={onSync}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                {user.githubId}
              </span>
              <Avatar className="h-8 w-8">
                <AvatarImage src={`https://github.com/${user.githubId}.png`} alt={user.githubId} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar;