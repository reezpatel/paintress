import { useState, useEffect } from 'react';
import {
  PlusIcon,
  FolderIcon,
  ServerIcon,
  ClockIcon,
  RotateCcwIcon,
  MoreVerticalIcon,
  EditIcon,
  TrashIcon,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { CreateWorkspaceModal } from './create-workspace-modal';
import { RestoreWorkspaceModal } from './restore-workspace-modal';
import { RenameWorkspaceModal } from './rename-workspace-modal';
import { DeleteWorkspaceDialog } from './delete-workspace-dialog';
import { Workspace, CreateWorkspaceData } from '../../types/workspace';
import { workspaceStorage } from '../../lib/workspace-storage';

interface WorkspaceSwitcherProps {
  onWorkspaceSelect?: (workspace: Workspace) => void;
}

export function WorkspaceSwitcher({
  onWorkspaceSelect,
}: WorkspaceSwitcherProps) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const loadWorkspaces = async () => {
    try {
      const storedWorkspaces = await workspaceStorage.getWorkspaces();
      setWorkspaces(
        storedWorkspaces.sort(
          (a, b) =>
            new Date(b.lastAccessedAt).getTime() -
            new Date(a.lastAccessedAt).getTime()
        )
      );
    } catch (error) {
      console.error('Failed to load workspaces:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWorkspace = async (data: CreateWorkspaceData) => {
    try {
      // Create workspace.json file if using local provider
      if (data.provider === 'local' && data.directoryHandle) {
        const workspaceFile = await data.directoryHandle.getFileHandle(
          'workspace.json',
          {
            create: true,
          }
        );
        const writer = await workspaceFile.createWritable();
        await writer.write(
          JSON.stringify(
            {
              name: data.name,
              provider: data.provider,
              createdAt: new Date().toISOString(),
              plugins: [],
              settings: {},
            },
            null,
            2
          )
        );
        await writer.close();
      }

      const newWorkspace: Workspace = {
        id: crypto.randomUUID(),
        name: data.name,
        path:
          data.provider === 'local' && data.directoryHandle
            ? data.directoryHandle.name
            : 'Paintress Server',
        provider: data.provider,
        createdAt: new Date(),
        lastAccessedAt: new Date(),
      };

      await workspaceStorage.saveWorkspace(newWorkspace);
      await loadWorkspaces();
    } catch (error) {
      console.error('Failed to create workspace:', error);
      throw error;
    }
  };

  const handleWorkspaceClick = async (workspace: Workspace) => {
    try {
      await workspaceStorage.updateLastAccessed(workspace.id);
      await loadWorkspaces(); // Refresh to update sort order
      onWorkspaceSelect?.(workspace);
    } catch (error) {
      console.error('Failed to update workspace access time:', error);
    }
  };

  const handleRestoreWorkspaces = async (workspacesToRestore: Workspace[]) => {
    try {
      // Save all restored workspaces to IndexedDB
      for (const workspace of workspacesToRestore) {
        await workspaceStorage.saveWorkspace(workspace);
      }

      // Reload the workspace list
      await loadWorkspaces();
    } catch (error) {
      console.error('Failed to restore workspaces:', error);
      throw error;
    }
  };

  const handleRenameWorkspace = async (
    workspaceId: string,
    newName: string
  ) => {
    try {
      await workspaceStorage.renameWorkspace(workspaceId, newName);
      await loadWorkspaces();
    } catch (error) {
      console.error('Failed to rename workspace:', error);
      throw error;
    }
  };

  const handleDeleteWorkspace = async (workspaceId: string) => {
    try {
      await workspaceStorage.deleteWorkspace(workspaceId);
      await loadWorkspaces();
    } catch (error) {
      console.error('Failed to delete workspace:', error);
      throw error;
    }
  };

  const handleWorkspaceAction = (
    workspace: Workspace,
    action: 'rename' | 'delete'
  ) => {
    setSelectedWorkspace(workspace);
    if (action === 'rename') {
      setIsRenameModalOpen(true);
    } else if (action === 'delete') {
      setIsDeleteDialogOpen(true);
    }
  };

  const formatLastAccessed = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading workspaces...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Welcome to Paintress</h1>
          <p className="text-muted-foreground">
            Select a workspace to continue or create a new one
          </p>
        </div>

        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Workspaces</h2>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsRestoreModalOpen(true)}
              >
                <RotateCcwIcon className="size-4" />
                Restore Workspace
              </Button>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <PlusIcon className="size-4" />
                Create Workspace
              </Button>
            </div>
          </div>

          {workspaces.length === 0 ? (
            <Card className="p-8 text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <FolderIcon className="size-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">No workspaces yet</h3>
                <p className="text-muted-foreground text-sm">
                  Create your first workspace or restore an existing one to get
                  started with Paintress
                </p>
              </div>
              <div className="flex justify-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsRestoreModalOpen(true)}
                >
                  <RotateCcwIcon className="size-4" />
                  Restore Existing
                </Button>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <PlusIcon className="size-4" />
                  Create New
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid gap-3">
              {workspaces.map((workspace) => (
                <Card
                  key={workspace.id}
                  className="p-4 hover:bg-accent/50 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="flex items-center space-x-3 flex-1 cursor-pointer"
                      onClick={() => handleWorkspaceClick(workspace)}
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        {workspace.provider === 'local' ? (
                          <FolderIcon className="size-5 text-primary" />
                        ) : (
                          <ServerIcon className="size-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{workspace.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {workspace.path}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <ClockIcon className="size-4" />
                        <span>
                          {formatLastAccessed(workspace.lastAccessedAt)}
                        </span>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
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
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateWorkspaceModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onCreateWorkspace={handleCreateWorkspace}
      />

      <RestoreWorkspaceModal
        open={isRestoreModalOpen}
        onOpenChange={setIsRestoreModalOpen}
        onRestoreWorkspaces={handleRestoreWorkspaces}
      />

      <RenameWorkspaceModal
        open={isRenameModalOpen}
        onOpenChange={setIsRenameModalOpen}
        workspace={selectedWorkspace}
        onRename={handleRenameWorkspace}
      />

      <DeleteWorkspaceDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        workspace={selectedWorkspace}
        onDelete={handleDeleteWorkspace}
      />
    </div>
  );
}
