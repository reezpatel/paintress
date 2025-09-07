import { IPlugin } from 'react-pluggable';

export type PluginManifest = {
  id: string;
  icon: string;
};

export interface PaintressPluginStore extends IPlugin {
  manifest: PluginManifest;
}

export * from './types';
