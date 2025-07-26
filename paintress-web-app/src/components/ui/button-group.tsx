import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md border bg-background p-1 gap-1",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ButtonGroup.displayName = "ButtonGroup";

interface ButtonGroupItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

const ButtonGroupItem = React.forwardRef<
  HTMLButtonElement,
  ButtonGroupItemProps
>(({ className, active, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center text-muted-foreground justify-center whitespace-nowrap rounded-sm px-2 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        active
          ? "bg-primary/25 text-foreground shadow-sm"
          : "hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});
ButtonGroupItem.displayName = "ButtonGroupItem";

export { ButtonGroup, ButtonGroupItem };
