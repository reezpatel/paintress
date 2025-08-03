import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authStore } from "@/lib/store/auth.store";
import { Box, Home, Sparkle } from "lucide-react";
import { Link } from "react-router";

const items = [
  {
    label: "Home",
    href: "/home",
    icon: Home,
  },
  {
    label: "AI Assistant",
    href: "/ai",
    icon: Sparkle,
  },
];

export const HomeSidebar = () => {
  return (
    <Sidebar
      collapsible="none"
      className="flex-1 md:flex w-[calc(var(--sidebar-width)-3.8rem)]! md:w-[calc(var(--sidebar-width)-3rem)]! border-r"
    >
      <SidebarContent>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden pt-16">
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton asChild>
                  <Link to={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-0">
        <OfflineMode />
      </SidebarFooter>
    </Sidebar>
  );
};

export const OfflineMode = () => {
  const setIsOffline = authStore((state) => state.setIsOffline);

  return (
    <div className="px-4 py-4 border-sidebar-border border-t flex gap-3">
      <Box className="h-4 w-4" />
      <p className="text-sm">Evaluation Mode</p>

      <div className="flex-1"> </div>

      <a
        className="text-sm text-secondary-foreground underline underline-offset-2"
        onClick={() => {
          setIsOffline(false);
        }}
      >
        Create Account
      </a>
    </div>
  );
};
