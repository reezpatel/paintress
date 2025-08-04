import { useEffect, useMemo } from "react";
import { dragAndDropFeature, hotkeysCoreFeature, keyboardDragAndDropFeature, selectionFeature, syncDataLoaderFeature } from "@headless-tree/core";
import { AssistiveTreeDescription, useTree } from "@headless-tree/react";

import { Tree, TreeItem, TreeItemLabel } from "@/components/tree";
import type { Folder, Note } from "@/lib/repo/model";
import { repoStore } from "@/lib/store/repo.store";
import { cn } from "@/lib/utils";

import { SquarePen } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { noteStore } from "@/lib/store/note-store";

interface Item {
  name: string;
  id: string;
  icon: string;
  isFolder: boolean;
}

const createItems = (notes: Note[], folders: Folder[]) => {
  const rootFolders = folders.filter((folder) => !folder.parent_folder_id);
  const rootNotes = notes.filter((note) => !note.folder_id);

  const itemMap: Record<string, Item> = {};

  folders.forEach((folder) => {
    itemMap[folder.id] = {
      id: folder.id,
      name: folder.name,
      icon: folder.icon,
      isFolder: true,
    };
  });

  notes.forEach((note) => {
    itemMap[note.id] = {
      id: note.id,
      name: note.title,
      icon: "",
      isFolder: false,
    };
  });

  return {
    root: {
      id: "root",
      name: "root",
      icon: "",
      children: [...rootFolders.map((folder) => folder.id), ...rootNotes.map((note) => note.id)],
    },
    items: itemMap,
  };
};

const indent = 20;

export const TreeSidebar = ({ notes, folders, refetch }: { notes: Note[]; folders: Folder[]; refetch: () => void }) => {
  const updateFolderIdForNotes = repoStore((state) => state.repo.notes.updateFolderIdForNotes);
  const updateFolderIdForFolders = repoStore((state) => state.repo.folder.updateFolderIdForFolders);

  const setShowUpdateFolder = noteStore((state) => state.setShowUpdateFolder);

  const { bookId } = useParams();
  const navigate = useNavigate();

  const items = useMemo(() => {
    return createItems(notes, folders);
  }, [notes, folders]);

  const tree = useTree<Item>({
    initialState: {},
    indent,
    rootItemId: "root",
    getItemName: (item) => item.getItemData()?.name ?? "Unknown",
    isItemFolder: (item) => item.getItemData()?.isFolder ?? false,
    canReorder: true,
    onDrop: async (items, target) => {
      console.log({
        items: items.map((item) => item.getItemData().name),
        target: target.item.getItemData().name,
      });

      let folderId = target.item.getItemData().id;

      if (folderId === "root") {
        folderId = "";
      }

      await updateFolderIdForNotes(
        items.map((item) => item.getItemData().id),
        folderId
      );

      await updateFolderIdForFolders(
        items.map((item) => item.getItemData().id),
        folderId
      );

      refetch();
    },
    dataLoader: {
      getItem: (itemId) => {
        if (itemId === "root") {
          return {
            id: "root",
            name: "root",
            icon: "",
            isFolder: true,
          };
        }

        return items.items[itemId];
      },
      getChildren: (itemId) => {
        if (itemId === "root") {
          return items.root.children;
        }

        const item = items.items[itemId];

        if (!item.isFolder) {
          return [];
        }

        const filteredNotes = notes.filter((note) => note.folder_id === itemId);
        const filteredFolders = folders.filter((folder) => folder.parent_folder_id === itemId);

        return [...filteredFolders.map((folder) => folder.id), ...filteredNotes.map((note) => note.id)];
      },
    },
    onPrimaryAction: (item) => {
      if (item.isFolder()) {
        return;
      }

      navigate(`/${bookId}/${item.getItemData().id}`);
    },
    features: [syncDataLoaderFeature, selectionFeature, hotkeysCoreFeature, dragAndDropFeature, keyboardDragAndDropFeature],
  });

  useEffect(() => {
    tree?.rebuildTree();
  }, [items, tree]);

  return (
    <Tree
      className="relative h-full before:absolute before:inset-0 before:-ms-1 before:bg-[repeating-linear-gradient(to_right,transparent_0,transparent_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)))]"
      indent={indent}
      tree={tree}
    >
      <AssistiveTreeDescription tree={tree} />
      {tree.getItems().map((item) => {
        return (
          <TreeItem
            key={item.getId()}
            item={item}
            className={cn("pb-0! relative hover:bg-sidebar-accent! [&:hover_.dropdown-trigger]:opacity-100", {
              "bg-sidebar-accent!": item.isSelected(),
            })}
          >
            <TreeItemLabel className="rounded-none py-1.5 flex-1">
              <span className="flex items-center gap-2 w-full ">
                <span>{item.getItemData().icon}</span>
                <span className="flex-1 text-start">{item.getItemName()}</span>
              </span>
            </TreeItemLabel>

            {item.isFolder() && (
              <div className="px-2 grid place-items-center absolute right-0 top-0 bottom-0">
                <button
                  className="dropdown-trigger opacity-0 transition-opacity duration-200 p-1 rounded-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUpdateFolder(true, item.getItemData().id);
                  }}
                >
                  <SquarePen className="h-4 w-4" />
                </button>
              </div>
            )}
          </TreeItem>
        );
      })}

      <div className="flex-1 z-10 bg-sidebar min-h-6"></div>
    </Tree>
  );
};
