import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { create } from 'zustand';
import { get, set, del } from 'idb-keyval'; // can use anything: IndexedDB, Ionic Storage, etc.
import { WorkspaceModel } from './types/workspace';

// Custom storage object
const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    console.log(name, 'has been retrieved');
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    console.log(name, 'with value', value, 'has been saved');
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    console.log(name, 'has been deleted');
    await del(name);
  },
};

interface WorkspaceStore {
  workspaces: WorkspaceModel[];
  addWorkspaces: (arr: WorkspaceModel[]) => void;
  renameWorkspace: (workspaceId: string, newName: string) => void;
}

export const useWorkspaceStore = create(
  persist<WorkspaceStore>(
    (set) => ({
      workspaces: [],
      addWorkspaces: (arr: WorkspaceModel[]) => {
        set((state) => ({ workspaces: [...state.workspaces, ...arr] }));
      },
      renameWorkspace: (workspaceId: string, newName: string) => {
        set((state) => ({
          workspaces: state.workspaces.map((workspace) => (workspace.id === workspaceId ? { ...workspace, name: newName } : workspace)),
        }));
      },
    }),
    {
      name: 'workspace_store', // unique name
      storage: createJSONStorage(() => storage),
    }
  )
);
