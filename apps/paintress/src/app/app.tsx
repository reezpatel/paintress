import { useState } from 'react';
import { WorkspaceSwitcher } from '../components/workspace/workspace-switcher';
import { Workspace } from '../types/workspace';

export function App() {
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(
    null
  );

  const handleWorkspaceSelect = (workspace: Workspace) => {
    setSelectedWorkspace(workspace);
  };

  if (!selectedWorkspace) {
    return <WorkspaceSwitcher onWorkspaceSelect={handleWorkspaceSelect} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{selectedWorkspace.name}</h1>
          <button
            onClick={() => setSelectedWorkspace(null)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Switch Workspace
          </button>
        </div>
        <div className="text-center text-muted-foreground">
          Workspace content will go here
        </div>
      </div>
    </div>
  );
}

export default App;
