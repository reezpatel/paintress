import { PaintressBlob } from './blob.js';
import { PaintressDB } from './db.js';
import { PaintressEditor } from './editor.js';

export interface PaintressPlugin {
  plugin: {
    name: string;
    image: string;
    group: string;
    version: string;

    dependencies: Array<{
      plugin: string;
      version: string;
    }>;
  };

  db?: PaintressDB;
  blob?: PaintressBlob;
  editor?: PaintressEditor;
  workspace?: PaintressWorkspace;
}
