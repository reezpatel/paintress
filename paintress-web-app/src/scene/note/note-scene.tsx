import { AppHeader } from "@/components/app-header";
import { Editor } from "@/components/editor/editor";
import { noteStore } from "@/lib/store/note-store";
import { repoStore } from "@/lib/store/repo.store";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

export const NoteScene = () => {
  const { bookId, noteId } = useParams();
  const repo = repoStore((state) => state.repo);

  const fetchNotes = noteStore((state) => state.fetchNotes);

  const { data: note } = useQuery({
    queryKey: ["note", bookId, noteId],
    queryFn: () => repo.notes.getNote(bookId || "", noteId || ""),
    enabled: !!bookId && !!noteId,
  });

  return (
    <>
      <AppHeader
        title={note?.title || "Note"}
        titleEditable={true}
        onTitleEdit={(title) => {
          repo.notes.updateNote(noteId || "", { title });
          fetchNotes();
        }}
      />
      <Editor content={JSON.stringify(note, null, 2)} />
    </>
  );
};
