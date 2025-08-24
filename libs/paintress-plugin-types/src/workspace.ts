import React from 'react';

export type Workspace = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface PaintressWorkspace {
  renderer: {
    workspacePicker: (done: () => void) => React.ReactNode;
  };
  getActiveWorkspace: () => Promise<Workspace>;
}
