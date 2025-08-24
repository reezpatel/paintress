export type StorageProvider = 'local' | 'server';

export interface Workspace {
  id: string;
  name: string;
  path: string;
  provider: StorageProvider;
  createdAt: Date;
  lastAccessedAt: Date;
}

export interface WorkspaceStorage {
  getWorkspaces(): Promise<Workspace[]>;
  saveWorkspace(workspace: Workspace): Promise<void>;
  deleteWorkspace(id: string): Promise<void>;
  updateLastAccessed(id: string): Promise<void>;
}

export interface CreateWorkspaceData {
  name: string;
  provider: StorageProvider;
  directoryHandle?: FileSystemDirectoryHandle;
}
