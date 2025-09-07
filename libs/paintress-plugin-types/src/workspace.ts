import React from 'react';

export type Workspace = {
  id: string;
  name: string;
  icon?: string;
  initialized: boolean;
};

export interface PaintressWorkspace {
  renderer: {
    workspacePicker: (done: () => void) => React.ReactNode;
  };
  getActiveWorkspace: () => Promise<Workspace>;
}
