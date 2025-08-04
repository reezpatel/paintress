import { EmojiFormInput } from "@/components/form-field/emoji-form-input";
import { TextFormInput } from "@/components/form-field/text-form-input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { noteStore } from "@/lib/store/note-store";
import { repoStore } from "@/lib/store/repo.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

const updateFolderSchema = z.object({
  name: z.string({ message: "Folder name is required" }).min(1),
  icon: z.string(),
});

type UpdateFolderFormData = z.infer<typeof updateFolderSchema>;

export const UpdateFolder = () => {
  const open = noteStore((state) => state.showUpdateFolder);
  const folderIdToUpdate = noteStore((state) => state.folderIdToUpdate);
  const setShowUpdateFolder = noteStore((state) => state.setShowUpdateFolder);
  const fetchFolders = noteStore((state) => state.fetchFolders);
  const repo = repoStore((state) => state.repo);

  const methods = useForm<UpdateFolderFormData>({
    defaultValues: {
      name: "",
      icon: "📁",
    },
    resolver: zodResolver(updateFolderSchema),
  });

  const { reset } = methods;

  const onSubmit: SubmitHandler<UpdateFolderFormData> = async (data) => {
    if (!folderIdToUpdate) return;

    await repo.folder.updateFolder(folderIdToUpdate, data);
    await fetchFolders();
    setShowUpdateFolder(false);
    reset();
  };

  const folders = noteStore((state) => state.folders);

  useEffect(() => {
    if (open && folderIdToUpdate && folders.length > 0) {
      const folder = folders.find((folder) => folder.id === folderIdToUpdate);

      if (folder) {
        reset({
          name: folder.name,
          icon: folder.icon,
        });
      }
    }
  }, [open, folderIdToUpdate, reset, folders]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => setShowUpdateFolder(isOpen)}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Update Folder</DialogTitle>
        </DialogHeader>

        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Form {...methods}>
            <FormProvider {...methods}>
              <TextFormInput name="name" label="Folder Name" placeholder="Enter folder name" left={<EmojiFormInput name="icon" />} />
            </FormProvider>

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setShowUpdateFolder(false)}>
                Cancel
              </Button>
              <Button type="submit">Update</Button>
            </DialogFooter>
          </Form>
        </form>
      </DialogContent>
    </Dialog>
  );
};
