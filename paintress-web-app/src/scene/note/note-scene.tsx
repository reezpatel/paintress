import { AppHeader } from "@/components/app-header";
import { Editor } from "@/components/editor/editor";
import { repoStore } from "@/lib/store/repo.store";
import { useQuery } from "@tanstack/react-query";
import { Edit } from "lucide-react";
import { useParams } from "react-router";

export const NoteScene = () => {
  const { bookId, noteId } = useParams();

  const repo = repoStore((state) => state.repo);

  const { data: note } = useQuery({
    queryKey: ["note", bookId, noteId],
    queryFn: () => repo.notes.getNote(bookId || "", noteId || ""),
    enabled: !!bookId && !!noteId,
  });

  return (
    <>
      <AppHeader
        title={note?.title || "Note"}
        menu={[{ label: "Edit", icon: Edit, onClick: () => {} }]}
      />
      <Editor content={JSON.stringify(note, null, 2)} />
    </>
  );
};
