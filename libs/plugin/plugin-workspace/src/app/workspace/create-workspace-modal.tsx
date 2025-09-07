import { useEffect, useState } from 'react';
import { EllipsisVertical, ExternalLinkIcon, FolderIcon, ServerIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@paintress/paintress-ui';
import { Button } from '@paintress/paintress-ui';
import { Input } from '@paintress/paintress-ui';
import { RadioGroup, RadioGroupItem } from '@paintress/paintress-ui';
import { StorageProvider, WorkspaceModel } from '../types/workspace';
import { useWorkspaceStore } from '../store';

interface CreateWorkspaceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateWorkspace: (workspaces: WorkspaceModel[]) => void;
}

export function CreateWorkspaceModal({ open, onOpenChange, onCreateWorkspace }: CreateWorkspaceModalProps) {
  const workspaces = useWorkspaceStore((state) => state.workspaces);

  const [name, setName] = useState('');
  const [provider, setProvider] = useState<StorageProvider>('local');
  const [directoryHandle, setDirectoryHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [isServerConnected, setIsServerConnected] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [isDirectoryEmpty, setIsDirectoryEmpty] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const getWorkspaceJson = async (directoryHandle: FileSystemDirectoryHandle) => {
    const workspaceFile = await directoryHandle.getFileHandle('workspace.json');
    const content = await (workspaceFile as FileSystemFileHandle)?.getFile();
    const buffer = await (content as File).arrayBuffer();
    const jsonRaw = new TextDecoder().decode(buffer);
    return JSON.parse(jsonRaw) as WorkspaceModel;
  };

  const handleSelectDirectory = async () => {
    try {
      // @ts-expect-error - File System Access API types not fully available
      const handle = await window.showDirectoryPicker();

      const items = await Array.fromAsync(handle.values());

      const workspaceFile = items.find((item) => (item as FileSystemFileHandle).name === 'workspace.json');

      const workspaceJson = workspaceFile ? await getWorkspaceJson(handle) : undefined;

      if (workspaceJson) {
        setName(workspaceJson.name);
      }

      setIsDirectoryEmpty(items.length === 0 || !!workspaceFile);
      setIsRestoring(!!workspaceFile);
      setDirectoryHandle(handle);
    } catch (error) {
      console.error('Failed to select directory:', error);
    }
  };

  const handleConnectServer = async () => {
    // Simulate server connection
    setIsServerConnected(true);
  };

  const handleCreate = async () => {
    if (!name.trim()) return;

    if (provider === 'local' && !directoryHandle) {
      alert('Please select a directory for local storage');
      return;
    }

    if (provider === 'server' && !isServerConnected) {
      alert('Please connect to the Paintress server first');
      return;
    }

    if (isRestoring) {
      const workspaceJson = await getWorkspaceJson(directoryHandle as FileSystemDirectoryHandle);

      const isDuplicate = workspaces.some((workspace) => workspace.id === workspaceJson.id);

      if (isDuplicate) {
        alert('Workspace already exists');
        onOpenChange(false);
        return;
      }

      onCreateWorkspace([
        {
          ...workspaceJson,
          name: name.trim(),
        },
      ]);
      onOpenChange(false);

      return;
    }

    try {
      setIsCreating(true);

      const workspace: WorkspaceModel = {
        id: crypto.randomUUID(),
        name: name.trim(),
        path: directoryHandle?.name || '',
        provider: 'local',
        createdAt: new Date(),
        lastAccessedAt: new Date(),
        directoryHandle: directoryHandle || undefined,
        icon: undefined,
        initialized: false,
      };

      // write to file system api

      const workspaceFile = await directoryHandle?.getFileHandle('workspace.json', { create: true });

      const writable = await workspaceFile?.createWritable({ keepExistingData: false });

      if (writable) {
        const content = JSON.stringify(workspace);
        await writable.write(new Blob([content], { type: 'application/json' }));
        await writable.close();
      }

      onCreateWorkspace([workspace]);

      setName('');
      setProvider('local');
      setDirectoryHandle(null);
      setIsServerConnected(false);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create workspace:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="items-start">
          <DialogTitle>Create New Workspace</DialogTitle>
          <DialogDescription className="text-left text-sm">
            Set up a new workspace for your projects and choose your storage provider.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="py-6">
            <Input id="workspace-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter workspace name" />
          </div>

          <div className="flex gap-2 justify-end">
            <Button>Create Remote Workspace</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="secondary">
                  <EllipsisVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48" align="end">
                <DropdownMenuItem>Create Local Workspace</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
