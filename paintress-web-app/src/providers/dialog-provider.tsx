import { CreateBook } from "@/scene/book/create-book";

export const DialogProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <CreateBook />
      <>{children}</>
    </>
  );
};
