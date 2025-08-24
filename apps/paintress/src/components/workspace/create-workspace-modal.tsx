import { useState } from 'react';
import { ExternalLinkIcon, FolderIcon, ServerIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { StorageProvider, CreateWorkspaceData } from '../../types/workspace';

interface CreateWorkspaceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateWorkspace: (data: CreateWorkspaceData) => Promise<void>;
}

export function CreateWorkspaceModal({
  open,
  onOpenChange,
  onCreateWorkspace,
}: CreateWorkspaceModalProps) {
  const [name, setName] = useState('');
  const [provider, setProvider] = useState<StorageProvider>('local');
  const [directoryHandle, setDirectoryHandle] =
    useState<FileSystemDirectoryHandle | null>(null);
  const [isServerConnected, setIsServerConnected] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleSelectDirectory = async () => {
    try {
      // @ts-expect-error - File System Access API types not fully available
      const handle = await window.showDirectoryPicker();
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

    try {
      setIsCreating(true);
      await onCreateWorkspace({
        name: name.trim(),
        provider,
        directoryHandle: directoryHandle || undefined,
      });

      // Reset form
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

  const canCreate =
    name.trim() &&
    ((provider === 'local' && directoryHandle) ||
      (provider === 'server' && isServerConnected));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Workspace</DialogTitle>
          <DialogDescription>
            Set up a new workspace for your projects and choose your storage
            provider.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="workspace-name" className="text-sm font-medium">
              Workspace Name
            </label>
            <Input
              id="workspace-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter workspace name"
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium">Storage Provider</label>
            <RadioGroup
              value={provider}
              onValueChange={(value) => setProvider(value as StorageProvider)}
            >
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 border rounded-lg">
                  <RadioGroupItem value="local" id="local" className="mt-1" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <FolderIcon className="size-4" />
                      <label
                        htmlFor="local"
                        className="font-medium cursor-pointer"
                      >
                        Local File System
                      </label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Store workspace data and plugins locally on your device.
                      Perfect for offline work and complete privacy control.
                    </p>
                    {provider === 'local' && (
                      <div className="pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleSelectDirectory}
                          className="w-full"
                        >
                          <FolderIcon className="size-4" />
                          {directoryHandle
                            ? directoryHandle.name
                            : 'Select Folder'}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg">
                  <RadioGroupItem value="server" id="server" className="mt-1" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <ServerIcon className="size-4" />
                      <label
                        htmlFor="server"
                        className="font-medium cursor-pointer"
                      >
                        Paintress Server
                      </label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Cloud-based solution for seamless plugin management and
                      device synchronization. Access your workspace anywhere.
                    </p>
                    {provider === 'server' && (
                      <div className="pt-2">
                        <Button
                          type="button"
                          variant={isServerConnected ? 'secondary' : 'outline'}
                          size="sm"
                          onClick={handleConnectServer}
                          disabled={isServerConnected}
                          className="w-full"
                        >
                          <ExternalLinkIcon className="size-4" />
                          {isServerConnected
                            ? 'Connected to Server'
                            : 'Connect to Server'}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!canCreate || isCreating}>
            {isCreating ? 'Creating...' : 'Create Workspace'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
