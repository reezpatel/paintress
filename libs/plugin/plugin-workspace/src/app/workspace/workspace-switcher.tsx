import { useState } from 'react';
import { FolderIcon, ServerIcon, MoreVerticalIcon, EditIcon, TrashIcon } from 'lucide-react';
import {
  Button,
  Card,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@paintress/paintress-ui';
import { WorkspaceModel } from '../types/workspace';
import { useWorkspaceStore } from '../store';
import { RenameWorkspaceModal } from './rename-workspace-modal';

interface WorkspaceSwitcherProps {
  onWorkspaceSelect?: (workspace: WorkspaceModel) => void;
}

export function WorkspaceSwitcher({ onWorkspaceSelect }: WorkspaceSwitcherProps) {
  const workspaces = useWorkspaceStore((s) => s.workspaces);
  const renameWorkspace = useWorkspaceStore((s) => s.renameWorkspace);

  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<WorkspaceModel | null>(null);

  const handleWorkspaceClick = async (workspace: WorkspaceModel) => {
    try {
      // await workspaceStorage.updateLastAccessed(workspace.id);
      // await loadWorkspaces(); // Refresh to update sort order
      onWorkspaceSelect?.(workspace);
    } catch (error) {
      console.error('Failed to update workspace access time:', error);
    }
  };

  const handleDeleteWorkspace = async (workspaceId: string) => {
    try {
      // await workspaceStorage.deleteWorkspace(workspaceId);
      // await loadWorkspaces();
    } catch (error) {
      console.error('Failed to delete workspace:', error);
      throw error;
    }
  };

  const handleWorkspaceAction = (workspace: WorkspaceModel, action: 'rename' | 'delete') => {
    setSelectedWorkspace(workspace);
    if (action === 'rename') {
      setIsRenameModalOpen(true);
    } else if (action === 'delete') {
      setIsDeleteDialogOpen(true);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {workspaces.map((workspace) => (
          <div key={workspace.id} className="group rounded-none">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 cursor-pointer" onClick={() => handleWorkspaceClick(workspace)}>
                <div className="w-11 h-11 bg-card rounded-lg flex items-center justify-center">
                  {workspace.provider === 'local' ? <FolderIcon className="size-4 text-primary" /> : <ServerIcon className="size-4 text-primary" />}
                </div>
                <div>
                  <h3 className="font-base text-sm">{workspace.name}</h3>
                  {/* <h4 className="font-light text-sm text-muted-foreground">Remote</h4> */}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 transition-opacity">
                      <MoreVerticalIcon className="size-4" />
                      <span className="sr-only">Workspace actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWorkspaceAction(workspace, 'rename');
                      }}
                    >
                      <EditIcon className="size-4" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWorkspaceAction(workspace, 'delete');
                      }}
                    >
                      <TrashIcon className="size-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        ))}
      </div>

      <RenameWorkspaceModal open={isRenameModalOpen} onOpenChange={setIsRenameModalOpen} workspace={selectedWorkspace} onRename={renameWorkspace} />

      {/*



      <DeleteWorkspaceDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        workspace={selectedWorkspace}
        onDelete={handleDeleteWorkspace}
      /> */}
    </>
  );
}
