import { create } from 'zustand';
import {
  createPluginStore,
  PluginStore,
  RendererPlugin,
} from 'react-pluggable';
import { WorkspacePlugin } from '@paintress/plugin-workspace';

export interface AppContext {
  store: PluginStore;
}

const store = createPluginStore();

store.install(new RendererPlugin());
store.install(new WorkspacePlugin());

export const useApplicationContext = create<AppContext>((set) => ({
  store,
}));
