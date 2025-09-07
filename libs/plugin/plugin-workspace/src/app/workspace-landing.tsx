import { FolderIcon, RotateCcwIcon, PlusIcon, LogInIcon, GithubIcon } from 'lucide-react';
import { WorkspaceModel } from './types/workspace';
import { Avatar, AvatarFallback, AvatarImage, Button, Card } from '@paintress/paintress-ui';
import { RestoreWorkspaceModal } from './workspace/restore-workspace-modal';
import { useState } from 'react';
import { useWorkspaceStore } from './store';
import { WorkspaceSwitcher } from './workspace/workspace-switcher';
import { CreateWorkspaceModal } from './workspace/create-workspace-modal';

export const WorkspaceWrapper = ({ children, onCreate, onRestore }: { children: React.ReactNode; onCreate: () => void; onRestore: () => void }) => {
  return (
    <div className="bg-background w-full max-w-xl mx-auto px-6 pt-12 md:pt-24 h-dvh flex flex-col justify-center gap-6">
      <div className="flex items-center gap-2">
        <Avatar className="rounded-lg bg-card">
          {/* <AvatarImage src="/paintress.svg" alt="Paintress" /> */}
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
        <Button variant="ghost" size="sm">
          <LogInIcon />
          Login
        </Button>
      </div>

      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl md:text-5xl font-medium tracking-wie">Paintress</h1>
          <h2 className="pt-2 text-base md:text-lg text-muted-foreground">A PKMS built for the modern age</h2>
        </div>

        <div>
          <Button size="icon" variant="secondary" className="bg-card">
            <GithubIcon />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-x-hidden overflow-y-scroll">{children}</div>

      <div className="shrink-0 pb-6 md:pb-24 flex gap-4">
        <Button className="flex-1" size="lg" onClick={onCreate}>
          Create Workspace
        </Button>
        <Button variant="outline" size="icon" onClick={onRestore}>
          <RotateCcwIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
};

export const WorkspaceEditor = ({ onWorkspaceSelect }: { onWorkspaceSelect: (workspace: WorkspaceModel) => void }) => {
  const addWorkspaces = useWorkspaceStore((s) => s.addWorkspaces);
  const workspaces = useWorkspaceStore((s) => s.workspaces);
  // TODO: restore selected workspace
  // Sync workspaces
  // Display UI

  const [openRestoreWorkspaceModal, setOpenRestoreWorkspaceModal] = useState(false);
  const [openCreateWorkspaceModal, setOpenCreateWorkspaceModal] = useState(false);

  const login = () => {
    console.log('login');
  };

  return (
    <>
      <WorkspaceWrapper onCreate={() => setOpenCreateWorkspaceModal(true)} onRestore={() => setOpenRestoreWorkspaceModal(true)}>
        {workspaces.length === 0 ? <WorkspaceEmptyState /> : <WorkspaceSwitcher onWorkspaceSelect={onWorkspaceSelect} />}
      </WorkspaceWrapper>
      <RestoreWorkspaceModal open={openRestoreWorkspaceModal} onOpenChange={setOpenRestoreWorkspaceModal} onRestoreWorkspaces={addWorkspaces} />
      <CreateWorkspaceModal open={openCreateWorkspaceModal} onOpenChange={setOpenCreateWorkspaceModal} onCreateWorkspace={addWorkspaces} />
    </>
  );
};

export const WorkspaceHeader = ({ onLogin, onCreateNew }: { onLogin: () => void; onCreateNew: () => void }) => {
  return (
    <div className="flex items-center justify-between border-b border-border p-4 ">
      <h2 className="text-lg font-medium">Workspaces</h2>
      <div className="flex gap-4">
        <Button onClick={onLogin}>
          <LogInIcon className="size-4" />
          Login to Paintress
        </Button>

        <Button variant="secondary" size="icon" onClick={onCreateNew}>
          <PlusIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
};

export const WorkspaceEmptyState = () => {
  return (
    <div className="h-full flex justify-center items-center">
      <Card className="px-8 py-12 md:py-24 text-center space-y-2 border-none rounded-md bg-secondary">
        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
          <FolderIcon className="size-8 text-muted-foreground" />
        </div>
        <div className="space-y-3">
          <h3 className="font-medium text-lg">No workspaces yet</h3>
          <p className="text-muted-foreground text-md">Create your first workspace or restore an existing one to get started with Paintress</p>
        </div>
      </Card>
    </div>
  );
};
