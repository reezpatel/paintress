import { Workspace, WorkspaceStorage } from '../types/workspace';

const DB_NAME = 'paintress-workspaces';
const DB_VERSION = 1;
const WORKSPACE_STORE = 'workspaces';

class IndexedDBWorkspaceStorage implements WorkspaceStorage {
  private db: IDBDatabase | null = null;

  private async initDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(WORKSPACE_STORE)) {
          const store = db.createObjectStore(WORKSPACE_STORE, {
            keyPath: 'id',
          });
          store.createIndex('name', 'name', { unique: false });
          store.createIndex('provider', 'provider', { unique: false });
        }
      };
    });
  }

  async getWorkspaces(): Promise<Workspace[]> {
    const db = await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([WORKSPACE_STORE], 'readonly');
      const store = transaction.objectStore(WORKSPACE_STORE);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const workspaces = request.result.map(
          (
            workspace: Workspace & { createdAt: string; lastAccessedAt: string }
          ) => ({
            ...workspace,
            createdAt: new Date(workspace.createdAt),
            lastAccessedAt: new Date(workspace.lastAccessedAt),
          })
        );
        resolve(workspaces);
      };
    });
  }

  async saveWorkspace(workspace: Workspace): Promise<void> {
    const db = await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([WORKSPACE_STORE], 'readwrite');
      const store = transaction.objectStore(WORKSPACE_STORE);
      const request = store.put({
        ...workspace,
        createdAt: workspace.createdAt.toISOString(),
        lastAccessedAt: workspace.lastAccessedAt.toISOString(),
      });

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async deleteWorkspace(id: string): Promise<void> {
    const db = await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([WORKSPACE_STORE], 'readwrite');
      const store = transaction.objectStore(WORKSPACE_STORE);
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async updateLastAccessed(id: string): Promise<void> {
    const workspaces = await this.getWorkspaces();
    const workspace = workspaces.find((w) => w.id === id);

    if (workspace) {
      workspace.lastAccessedAt = new Date();
      await this.saveWorkspace(workspace);
    }
  }

  async renameWorkspace(id: string, newName: string): Promise<void> {
    const workspaces = await this.getWorkspaces();
    const workspace = workspaces.find((w) => w.id === id);

    if (workspace) {
      workspace.name = newName;
      await this.saveWorkspace(workspace);
    }
  }
}

export const workspaceStorage = new IndexedDBWorkspaceStorage();
