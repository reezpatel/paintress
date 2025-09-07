import { useMemo } from 'react';
import { useApplicationContext } from './context';

export const useRenderer = () => {
  const store = useApplicationContext((s) => s.store);

  const Renderer = useMemo(
    () => store.executeFunction('Renderer.getRendererComponent'),
    [store]
  );

  return Renderer;
};
