import { CreateBook } from "@/scene/book/create-book";
import { UpdateFolder } from "@/scene/folder/update-folder";

export const DialogProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <CreateBook />
      <UpdateFolder />
      <>{children}</>
    </>
  );
};
