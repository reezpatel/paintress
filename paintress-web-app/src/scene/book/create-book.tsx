import { CheckboxFormInput } from "@/components/form-field/checkbox-form-input";
import { EmojiFormInput } from "@/components/form-field/emoji-form-input";
import { TextFormInput } from "@/components/form-field/text-form-input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
} from "@/components/ui/alert-1";
import { Form } from "@/components/ui/form";
import { bookStore } from "@/lib/store/book.store";
import { repoStore } from "@/lib/store/repo.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { AlertCircle, LucideArrowRight } from "lucide-react";

const createBookSchema = z.object({
  name: z.string({ error: "Book name is required" }).min(1),
  icon: z.string(),
  is_encrypted: z.boolean(),
});

type CreateBookFormData = z.infer<typeof createBookSchema>;

export const CreateBook = () => {
  const open = bookStore((state) => state.showCreateBook);
  const setBooks = bookStore((state) => state.setBooks);
  const setShowCreateBook = bookStore((state) => state.setShowCreateBook);
  const setOpen = bookStore((state) => state.setShowCreateBook);
  const repo = repoStore((state) => state.repo);
  const bookIdToUpdate = bookStore((state) => state.bookIdToUpdate);
  const books = bookStore((state) => state.books);

  const methods = useForm<CreateBookFormData>({
    defaultValues: {
      name: "",
      icon: "🔥",
      is_encrypted: false,
    },
    resolver: zodResolver(createBookSchema),
  });

  const { reset } = methods;

  const onSubmit: SubmitHandler<CreateBookFormData> = async (data) => {
    if (bookIdToUpdate) {
      await repo.books.updateBook(bookIdToUpdate, {
        name: data.name,
        icon: data.icon,
      });
    } else {
      await repo.books.createBook(data);
    }

    const books = await repo.books.getBooks();
    setBooks(books);
    setShowCreateBook(false);
    reset();
  };

  useEffect(() => {
    if (open && !bookIdToUpdate) {
      reset();
    }

    if (open && bookIdToUpdate) {
      const book = books.find((book) => book.id === bookIdToUpdate);
      if (book) {
        reset({
          name: book.name,
          icon: book.icon,
          is_encrypted: Boolean(book.is_encrypted),
        });
      }
    }
  }, [open, reset, bookIdToUpdate, books]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Create Book</DialogTitle>
        </DialogHeader>

        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Form {...methods}>
            <FormProvider {...methods}>
              <TextFormInput name="name" label="Book Name" placeholder="Enter book name" left={<EmojiFormInput name="icon" />} />
            </FormProvider>

            {!bookIdToUpdate && (
              <div className="pt-5 pb-2 flex justify-end">
                <a className="text-sm underline underline-offset-2 flex gap-1 items-center">
                  Set key phrase to enable encryption
                  <LucideArrowRight className="size-4" />
                </a>
              </div>
            )}

            <DialogFooter className="mt-4">
              <CheckboxFormInput disabled={!!bookIdToUpdate} name="isEncrypted" label="Encrypt Book" />
              <div className="flex-1" />
              <Button type="submit">{bookIdToUpdate ? "Update" : "Create"}</Button>
            </DialogFooter>

            <Alert className="mt-4" variant="secondary" close={false}>
              <AlertIcon>
                <AlertCircle />
              </AlertIcon>
              <AlertContent>
                <AlertDescription>Encryption settings cannot be changed after the book is created.</AlertDescription>
              </AlertContent>
            </Alert>
          </Form>
        </form>
      </DialogContent>
    </Dialog>
  );
};
