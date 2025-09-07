import { PluginProvider } from 'react-pluggable';
import { useApplicationContext } from './context';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { WorkspaceProvider } from './workspace';

const routes = createBrowserRouter([
  {
    path: '/',
    element: <div>Hello</div>,
  },
]);

export const App = () => {
  const store = useApplicationContext((s) => s.store);

  return (
    <PluginProvider pluginStore={store}>
      <WorkspaceProvider>
        <RouterProvider router={routes} />
      </WorkspaceProvider>
    </PluginProvider>
  );
};
