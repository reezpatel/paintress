import { NavUser } from "@/components/nav-user";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarFooter,
  Sidebar,
} from "@/components/ui/sidebar";
import { bookStore } from "@/lib/store/book.store";
import { repoStore } from "@/lib/store/repo.store";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Home, PlusCircle } from "lucide-react";
import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router";

const navMain = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
];

export const MainSidebar = () => {
  const repo = repoStore((state) => state.repo);
  const setBooks = bookStore((state) => state.setBooks);
  const setShowCreateBook = bookStore((state) => state.setShowCreateBook);
  const books = bookStore((state) => state.books);

  const navigate = useNavigate();
  const { bookId } = useParams();
  const location = useLocation();

  useEffect(() => {
    repo.books.getBooks().then((books) => {
      setBooks(books);
    });
  }, [repo, setBooks]);

  return (
    <Sidebar
      collapsible="none"
      className="w-[calc(3.8rem+1px)]! md:w-[calc(3rem+1px)]! border-r"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
              <a href="#">
                <img src="/logo.png" alt="logo" className="size-8 rounded-sm" />

                <div className="grid flex-1 text-left text-md leading-tight pl-2">
                  <span className="truncate font-medium">Paintress</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <div />

        <SidebarGroup>
          <SidebarGroupContent className="px-1.5 md:px-0">
            <SidebarMenu>
              {navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={{
                      children: item.title,
                      hidden: false,
                    }}
                    onClick={() => {
                      navigate(item.url);
                    }}
                    isActive={location.pathname === item.url}
                    className="px-2.5 md:px-2"
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <Separator />
        <SidebarGroup>
          <SidebarGroupContent className="px-1.5 md:px-0">
            <SidebarMenu>
              {books?.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    tooltip={{
                      children: item.name,
                      hidden: false,
                    }}
                    onClick={() => {
                      navigate(`/${item.id}`);
                    }}
                    isActive={bookId === item.id}
                    className="px-2.5 md:px-2"
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={{
                    children: "New Book",
                    hidden: false,
                  }}
                  onClick={() => {
                    setShowCreateBook(true);
                  }}
                  isActive={location.pathname === "/new-book"}
                  className="px-2.5 md:px-2"
                >
                  <PlusCircle />
                  <span>New Book</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
};
