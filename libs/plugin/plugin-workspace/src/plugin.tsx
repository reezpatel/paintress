import { PaintressPluginStore } from '@paintress/plugin-base';

import { PluginStore } from 'react-pluggable';
import { WorkspaceEditor } from './app/workspace-landing';

export class WorkspacePlugin implements PaintressPluginStore {
  pluginStore!: PluginStore;

  manifest = {
    id: '@paintress/workspace',
    icon: '🏠',
  };

  init(store: PluginStore) {
    this.pluginStore = store;
  }

  getPluginName() {
    return '@paintress/workspace@0.1.0';
  }

  getDependencies(): string[] {
    return [];
  }

  activate(): void {
    const onWorkspaceSelect = (workspace: any) => {
      console.log('WorkspacePlugin onWorkspaceSelect', workspace);
    };

    this.pluginStore.executeFunction('Renderer.add', 'workspace:editor', () => (
      <WorkspaceEditor onWorkspaceSelect={onWorkspaceSelect} />
    ));
  }

  deactivate(): void {
    //
  }
}
