import { useState } from 'react';
import { FolderIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@paintress/paintress-ui';
import { Button } from '@paintress/paintress-ui';
import { StorageProvider, WorkspaceModel } from '../types/workspace';

interface RestoreWorkspaceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRestoreWorkspaces: (workspaces: WorkspaceModel[]) => void;
}

interface WorkspaceConfig {
  id: string;
  name: string;
  provider: StorageProvider;
  createdAt: string;
  plugins?: any[];
  settings?: any;
}

export function RestoreWorkspaceModal({ open, onOpenChange, onRestoreWorkspaces }: RestoreWorkspaceModalProps) {
  const [directoryHandle, setDirectoryHandle] = useState<any | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateWorkspaceJson = (content: string): WorkspaceConfig | null => {
    try {
      const config = JSON.parse(content);

      // Validate required fields
      if (!config.name || typeof config.name !== 'string') {
        throw new Error('Invalid or missing "name" field');
      }

      if (!config.id || typeof config.id !== 'string') {
        throw new Error('Invalid or missing "id" field');
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
          setValidationError('Invalid workspace.json file. Please ensure it contains valid workspace configuration.');
          return;
        }

        setDirectoryHandle(handle);
        setValidationError(null);
      } catch (error) {
        setValidationError('workspace.json file not found in the selected directory. Please select a valid workspace folder.');
      }
    } catch (error) {
      console.error('Failed to select directory:', error);
    }
  };

  const handleRestore = async () => {
    try {
      setIsRestoring(true);
      const workspacesToRestore: WorkspaceModel[] = [];

      if (directoryHandle) {
        // Restore from local directory
        const workspaceFile = await directoryHandle.getFileHandle('workspace.json');
        const file = await workspaceFile.getFile();
        const content = await file.text();
        const config = validateWorkspaceJson(content);

        if (!config) {
          setValidationError('Invalid workspace configuration');
          return;
        }

        const workspace: WorkspaceModel = {
          id: config.id,
          name: config.name,
          path: directoryHandle.name,
          provider: 'local',
          createdAt: new Date(config.createdAt),
          lastAccessedAt: new Date(),
          initialized: false,
          directoryHandle,
        };

        workspacesToRestore.push(workspace);
      }

      onRestoreWorkspaces(workspacesToRestore);

      handleClose();
    } catch (error) {
      console.error('Failed to restore workspace:', error);
      setValidationError('Failed to restore workspace. Please try again.');
    } finally {
      setIsRestoring(false);
    }
  };

  const handleClose = () => {
    setDirectoryHandle(null);
    setValidationError(null);
    onOpenChange(false);
  };

  const canRestore = directoryHandle && !validationError;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Restore Existing Workspace</DialogTitle>
          <DialogDescription>Select a folder that contains a workspace.json file to restore your local workspace.</DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-2 py-2">
          <Button type="button" variant="outline" size="sm" onClick={handleSelectDirectory} className="w-full font-normal">
            <FolderIcon className="size-4" />
            {directoryHandle ? directoryHandle.name : 'Select Workspace Folder'}
          </Button>

          {validationError && <p className="text-sm text-destructive">{validationError}</p>}

          {directoryHandle && !validationError && (
            <p className="text-sm text-muted-foreground p-2 text-right">Workspace found, click "Restore Workspace" to continue</p>
          )}
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
