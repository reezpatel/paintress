import { useState } from 'react';
import {
  ExternalLinkIcon,
  FolderIcon,
  ServerIcon,
  CheckCircleIcon,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { StorageProvider, Workspace } from '../../types/workspace';

interface RestoreWorkspaceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRestoreWorkspaces: (workspaces: Workspace[]) => Promise<void>;
}

interface WorkspaceConfig {
  name: string;
  provider: StorageProvider;
  createdAt: string;
  plugins?: any[];
  settings?: any;
}

export function RestoreWorkspaceModal({
  open,
  onOpenChange,
  onRestoreWorkspaces,
}: RestoreWorkspaceModalProps) {
  const [provider, setProvider] = useState<StorageProvider>('local');
  const [directoryHandle, setDirectoryHandle] =
    useState<FileSystemDirectoryHandle | null>(null);
  const [isServerConnected, setIsServerConnected] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [restoredCount, setRestoredCount] = useState(0);

  const validateWorkspaceJson = (content: string): WorkspaceConfig | null => {
    try {
      const config = JSON.parse(content);

      // Validate required fields
      if (!config.name || typeof config.name !== 'string') {
        throw new Error('Invalid or missing "name" field');
      }

      if (!config.provider || !['local', 'server'].includes(config.provider)) {
        throw new Error('Invalid or missing "provider" field');
      }

      if (!config.createdAt || typeof config.createdAt !== 'string') {
        throw new Error('Invalid or missing "createdAt" field');
      }

      // Validate date format
      const createdDate = new Date(config.createdAt);
      if (isNaN(createdDate.getTime())) {
        throw new Error('Invalid date format in "createdAt" field');
      }

      return config as WorkspaceConfig;
    } catch (error) {
      return null;
    }
  };

  const handleSelectDirectory = async () => {
    try {
      setValidationError(null);
      // @ts-expect-error - File System Access API types not fully available
      const handle = await window.showDirectoryPicker();

      // Check if workspace.json exists in the selected directory
      try {
        const workspaceFile = await handle.getFileHandle('workspace.json');
        const file = await workspaceFile.getFile();
        const content = await file.text();

        const config = validateWorkspaceJson(content);
        if (!config) {
          setValidationError(
            'Invalid workspace.json file. Please ensure it contains valid workspace configuration.'
          );
          return;
        }

        setDirectoryHandle(handle);
        setValidationError(null);
      } catch (error) {
        setValidationError(
          'workspace.json file not found in the selected directory. Please select a valid workspace folder.'
        );
      }
    } catch (error) {
      console.error('Failed to select directory:', error);
    }
  };

  const handleConnectServer = async () => {
    // Simulate server connection
    setIsServerConnected(true);
  };

  const handleRestore = async () => {
    try {
      setIsRestoring(true);
      const workspacesToRestore: Workspace[] = [];

      if (provider === 'local' && directoryHandle) {
        // Restore from local directory
        const workspaceFile = await directoryHandle.getFileHandle(
          'workspace.json'
        );
        const file = await workspaceFile.getFile();
        const content = await file.text();
        const config = validateWorkspaceJson(content);

        if (!config) {
          setValidationError('Invalid workspace configuration');
          return;
        }

        const workspace: Workspace = {
          id: crypto.randomUUID(),
          name: config.name,
          path: directoryHandle.name,
          provider: 'local',
          createdAt: new Date(config.createdAt),
          lastAccessedAt: new Date(),
        };

        workspacesToRestore.push(workspace);
      } else if (provider === 'server' && isServerConnected) {
        // Simulate restoring from server
        const fakeWorkspaces: Workspace[] = [
          {
            id: crypto.randomUUID(),
            name: 'Design System Project',
            path: 'Paintress Server',
            provider: 'server',
            createdAt: new Date('2024-01-15'),
            lastAccessedAt: new Date('2024-01-20'),
          },
          {
            id: crypto.randomUUID(),
            name: 'Mobile App Wireframes',
            path: 'Paintress Server',
            provider: 'server',
            createdAt: new Date('2024-02-01'),
            lastAccessedAt: new Date('2024-02-05'),
          },
          {
            id: crypto.randomUUID(),
            name: 'Brand Identity Kit',
            path: 'Paintress Server',
            provider: 'server',
            createdAt: new Date('2024-02-10'),
            lastAccessedAt: new Date('2024-02-12'),
          },
          {
            id: crypto.randomUUID(),
            name: 'Web Dashboard UI',
            path: 'Paintress Server',
            provider: 'server',
            createdAt: new Date('2024-02-15'),
            lastAccessedAt: new Date('2024-02-18'),
          },
          {
            id: crypto.randomUUID(),
            name: 'Marketing Assets',
            path: 'Paintress Server',
            provider: 'server',
            createdAt: new Date('2024-02-20'),
            lastAccessedAt: new Date('2024-02-22'),
          },
        ];

        workspacesToRestore.push(...fakeWorkspaces);
      }

      await onRestoreWorkspaces(workspacesToRestore);
      setRestoredCount(workspacesToRestore.length);

      if (provider === 'server') {
        setShowSuccessDialog(true);
      } else {
        // For local restoration, close modal immediately
        handleClose();
      }
    } catch (error) {
      console.error('Failed to restore workspace:', error);
      setValidationError('Failed to restore workspace. Please try again.');
    } finally {
      setIsRestoring(false);
    }
  };

  const handleClose = () => {
    // Reset form
    setProvider('local');
    setDirectoryHandle(null);
    setIsServerConnected(false);
    setValidationError(null);
    setShowSuccessDialog(false);
    setRestoredCount(0);
    onOpenChange(false);
  };

  const canRestore =
    (provider === 'local' && directoryHandle && !validationError) ||
    (provider === 'server' && isServerConnected);

  if (showSuccessDialog) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="size-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <DialogTitle>Workspaces Restored Successfully</DialogTitle>
                <DialogDescription>
                  {restoredCount} workspace
                  {restoredCount !== 1 ? 's have' : ' has'} been restored from
                  the server.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Restore Existing Workspace</DialogTitle>
          <DialogDescription>
            Restore workspaces from your local file system or sync from the
            Paintress server.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <label className="text-sm font-medium">Restore From</label>
            <RadioGroup
              value={provider}
              onValueChange={(value) => {
                setProvider(value as StorageProvider);
                setDirectoryHandle(null);
                setIsServerConnected(false);
                setValidationError(null);
              }}
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
                      Select a folder that contains a workspace.json file to
                      restore your local workspace.
                    </p>
                    {provider === 'local' && (
                      <div className="pt-2 space-y-2">
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
                            : 'Select Workspace Folder'}
                        </Button>
                        {validationError && (
                          <p className="text-sm text-red-600 dark:text-red-400">
                            {validationError}
                          </p>
                        )}
                        {directoryHandle && !validationError && (
                          <p className="text-sm text-green-600 dark:text-green-400">
                            ✓ Valid workspace found
                          </p>
                        )}
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
                      Connect to the Paintress server to sync and restore your
                      cloud workspaces.
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
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleRestore} disabled={!canRestore || isRestoring}>
            {isRestoring ? 'Restoring...' : 'Restore Workspace'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
