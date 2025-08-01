"use client";

import { MoreHorizontal, LogOut, Settings } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { authStore } from "@/lib/store/auth.store";
import { useMemo, useState } from "react";
import { $api } from "@/lib/fetch";
import { useNavigate } from "react-router";

const parseToken = (token: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, payload] = `${token}`.split(".");

  const decoded = JSON.parse(atob(payload));

  return decoded;
};

export function NavUser() {
  const { isMobile } = useSidebar();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const navigate = useNavigate();

  const token = authStore((state) => state.token);
  const setToken = authStore((state) => state.setToken);

  const payload = useMemo(() => {
    if (!token) return null;

    return parseToken(token);
  }, [token]);

  const { mutate: logout } = $api.useMutation("post", "/api/v1/auth/logout", {
    onSuccess: () => {
      setToken(null);
      setShowLogoutDialog(false);
    },
    onError: () => {
      setToken(null);
      setShowLogoutDialog(false);
    },
  });

  const handleLogout = () => {
    logout({});
  };

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-accent/40 data-[state=open]:text-sidebar-accent-foreground md:h-8 md:p-0 grid place-items-center"
              >
                <MoreHorizontal />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-accent">
                      {payload?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {payload?.name}
                    </span>
                    <span className="truncate text-xs">{payload?.sub}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowLogoutDialog(true)}>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out? You will need to sign in again
              to access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
