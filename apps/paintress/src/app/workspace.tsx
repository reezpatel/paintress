import { PropsWithChildren, useState } from 'react';
import { useRenderer } from './use-renderer';
import { PaintressWorkspace } from '@paintress/plugin-base';

export const WorkspaceProvider = ({ children }: PropsWithChildren) => {
  const [activeWorkspace, setActiveWorkspace] =
    useState<PaintressWorkspace | null>(null);

  const Renderer = useRenderer();

  if (activeWorkspace) {
    return children;
  }

  return (
    <div>
      <Renderer placement={'workspace:editor'} />
    </div>
  );
};
