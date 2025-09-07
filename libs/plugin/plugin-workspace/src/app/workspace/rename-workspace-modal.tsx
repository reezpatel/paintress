import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@paintress/paintress-ui';
import { Button } from '@paintress/paintress-ui';
import { Input } from '@paintress/paintress-ui';
import { Workspace } from '@paintress/paintress-plugin-types';

interface RenameWorkspaceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspace: Workspace | null;
  onRename: (workspaceId: string, newName: string) => void;
}

export function RenameWorkspaceModal({ open, onOpenChange, workspace, onRename }: RenameWorkspaceModalProps) {
  const [name, setName] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);

  useEffect(() => {
    if (workspace) {
      setName(workspace.name);
    }
  }, [workspace]);

  const handleRename = async () => {
    if (!workspace || !name.trim() || name.trim() === workspace.name) return;

    try {
      setIsRenaming(true);
      await onRename(workspace.id, name.trim());
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to rename workspace:', error);
    } finally {
      setIsRenaming(false);
    }
  };

  const handleClose = () => {
    if (workspace) {
      setName(workspace.name);
    }
    onOpenChange(false);
  };

  const canRename = name.trim() && name.trim() !== workspace?.name;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Rename Workspace</DialogTitle>
          <DialogDescription>Enter a new name for "{workspace?.name}".</DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <Input
            id="workspace-name"
            value={name}
            onChange={(e) => setName((e.target as HTMLInputElement).value)}
            placeholder="Enter new workspace name"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && canRename) {
                handleRename();
              }
            }}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleRename} disabled={!canRename || isRenaming}>
            {isRenaming ? 'Renaming...' : 'Rename'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
