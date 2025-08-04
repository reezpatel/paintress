import { MoreVerticalIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

type AppHeaderProps = {
  title: string | React.ReactNode;
  titleEditable?: boolean;
  onTitleEdit?: (title: string) => void;
  menu?: [
    {
      label: string;
      icon: React.FC<{ className: string }>;
      onClick: () => void;
    }
  ];
  actions?: [
    {
      label: string;
      icon: React.FC<{ className: string }>;
      onClick: () => void;
    }
  ];
};

export const AppHeader = ({ title, titleEditable, onTitleEdit, actions, menu }: AppHeaderProps) => {
  return (
    <header className="bg-sidebar sticky top-0 flex shrink-0 items-center gap-2 border-b p-4 py-2.5 pr-2">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="data-[orientation=vertical]:h-4 mr-1" />

      <p
        className="text-sm font-medium text-muted-foreground p-2"
        contentEditable={titleEditable}
        onBlur={(e) => {
          if (onTitleEdit) {
            onTitleEdit((e.target as HTMLParagraphElement).innerText);
          }
        }}
      >
        {title}
      </p>

      <div className="flex-1 flex items-center justify-end">
        {actions?.map((action) => (
          <Button variant="ghost" size="icon" onClick={action.onClick}>
            {action.icon && <action.icon className="h-4 w-4" />}
          </Button>
        ))}

        {menu?.length && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVerticalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {menu.map((item) => (
                <DropdownMenuItem key={item.label} onClick={item.onClick}>
                  {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                  <span>{item.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};
