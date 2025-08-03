"use client";

import * as React from "react";

import { Sidebar } from "@/components/ui/sidebar";
import { MainSidebar } from "./main-sidebar";
import { BookSidebar } from "./book-sidebar";
import { useParams } from "react-router";
import { HomeSidebar } from "./home-sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { bookId } = useParams();
  return (
    <Sidebar collapsible="icon" className="overflow-hidden flex-row" {...props}>
      <MainSidebar />
      {bookId ? <BookSidebar /> : <HomeSidebar />}
    </Sidebar>
  );
}
