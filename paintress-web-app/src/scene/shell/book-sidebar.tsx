import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupItem } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInput,
} from "@/components/ui/sidebar";
import { SidebarGroup } from "@/components/ui/sidebar";
import { SidebarGroupContent } from "@/components/ui/sidebar";
import { authStore } from "@/lib/store/auth.store";
import { bookStore } from "@/lib/store/book.store";
import {
  Box,
  File,
  Folder,
  ListTodo,
  ListTree,
  Plus,
  SquareCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { EmptyState } from "@/components/ui/empty-state";
import { repoStore } from "@/lib/store/repo.store";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { TreeSidebar } from "./tree-sidebar";
import { cn } from "@/lib/utils";

export const BookSidebar = () => {
  const books = bookStore((state) => state.books);
  const { bookId, noteId } = useParams();
  const isOffline = authStore((state) => state.isOffline);
  const repo = repoStore((state) => state.repo);
  const navigate = useNavigate();

  const book = useMemo(() => {
    return books.find((book) => book.id === bookId);
  }, [books, bookId]);

  const [viewMode, setViewMode] = useState<"list" | "tree">("tree");

  const { data: notes, refetch } = useQuery({
    queryKey: ["notes", bookId],
    queryFn: () => repo.notes.getNotes(bookId!),
    enabled: !!bookId,
  });

  const { data: folders, refetch: refetchFolders } = useQuery({
    queryKey: ["folders", bookId],
    queryFn: () => repo.folder.getFolders(bookId!),
    enabled: !!bookId,
  });

  const createNewNote = async (
    folderId = "",
    type: "note" | "todo" = "note"
  ) => {
    if (!bookId) {
      throw new Error("Book ID is required");
    }

    const note = await repo.notes.createNote({ bookId, folderId, type });

    if (note?.id) {
      refetch();
      navigate(`/${bookId}/${note.id}`);
    }
  };

  const createNewFolder = async (parentFolderId = "") => {
    if (!bookId) {
      throw new Error("Book ID is required");
    }

    const folder = await repo.folder.createFolder(bookId, parentFolderId);

    if (folder?.id) {
      refetchFolders();
    }
  };

  const mappedNotes = useMemo(() => {
    return notes?.map((note) => ({
      ...note,
      folder_name: folders?.find((folder) => folder.id === note.folder_id)
        ?.name,
      updated_at: format(new Date(note.updated_at), "MMM d, yyyy"),
    }));
  }, [notes]);

  return (
    <Sidebar
      collapsible="none"
      className="flex-1 md:flex w-[calc(var(--sidebar-width)-3.8rem)]! md:w-[calc(var(--sidebar-width)-3rem)]! border-r"
    >
      <SidebarHeader className="gap-3.5 border-b p-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="text-foreground text-md font-medium">
            {book?.name}
          </div>

          <div className="flex items-center gap-2">
            <ButtonGroup>
              <ButtonGroupItem
                active={viewMode === "list"}
                onClick={() => setViewMode("list")}
              >
                <ListTodo className="h-4 w-4" />
              </ButtonGroupItem>
              <ButtonGroupItem
                active={viewMode === "tree"}
                onClick={() => setViewMode("tree")}
              >
                <ListTree className="h-4 w-4" />
              </ButtonGroupItem>
            </ButtonGroup>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="h-8 w-8">
                  <Plus className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => createNewNote()}>
                  <File className="h-4 w-4" />
                  Create Note
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => createNewNote("", "todo")}>
                  <SquareCheck className="h-4 w-4" />
                  Create Todo
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => createNewFolder()}>
                  <Folder className="h-4 w-4" />
                  Create Folder
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <SidebarInput placeholder="Type to search..." />
      </SidebarHeader>

      <SidebarContent className="w-[calc(var(--sidebar-width)-3.8rem)]! md:w-[calc(var(--sidebar-width)-3rem)]!">
        <div className="h-full">
          {!mappedNotes?.length && (
            <SidebarGroup className="px-0">
              <SidebarGroupContent>
                <div className="px-4 py-2">
                  <EmptyState
                    className="p-8"
                    title="No Notes Created"
                    description="You can create a new note to add in your book."
                    icons={[File]}
                    action={{
                      label: "Create Note",
                      onClick: () => createNewNote(),
                    }}
                  />
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {mappedNotes?.length && (
            <>
              {viewMode === "list" && (
                <SidebarGroup className="px-0">
                  <SidebarGroupContent>
                    {mappedNotes?.map((note) => (
                      <a
                        href="#"
                        key={note.id}
                        className={cn(
                          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col items-start gap-2 border-b p-4 text-sm leading-tight whitespace-nowrap last:border-b-0",
                          {
                            "bg-sidebar-accent/50": noteId === note.id,
                          }
                        )}
                        onClick={() => {
                          navigate(`/${bookId}/${note.id}`);
                        }}
                      >
                        <div className="flex w-full items-center gap-2">
                          <span>{note.folder_name}</span>{" "}
                          <span className="ml-auto text-xs">
                            {note.updated_at}
                          </span>
                        </div>
                        <span className="font-medium">{note.title}</span>
                        <span className="line-clamp-2 max-w-[260px] text-xs whitespace-break-spaces">
                          ...
                        </span>
                      </a>
                    ))}
                  </SidebarGroupContent>
                </SidebarGroup>
              )}
              {viewMode === "tree" && (
                <TreeSidebar
                  notes={notes || []}
                  folders={folders || []}
                  refetch={() => {
                    refetch();
                    refetchFolders();
                  }}
                />
              )}
            </>
          )}
        </div>
      </SidebarContent>

      <div>{isOffline && <OfflineMode />}</div>
    </Sidebar>
  );
};

export const OfflineMode = () => {
  const setIsOffline = authStore((state) => state.setIsOffline);

  return (
    <div className="p-6 border-sidebar-border border-t flex gap-3">
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
