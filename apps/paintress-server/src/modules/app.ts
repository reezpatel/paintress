import { createFactory } from 'hono/factory';

type Server = {
	Variables: {
		workspaceId: string;
	};
};

export const factory = createFactory<Server>();

export const authMiddleware = factory.createMiddleware(async (c, next) => {
	const authToken = c.req.header('authorization');

	if (!authToken || !authToken.startsWith('Bearer ')) {
		return c.json({ message: 'Unauthorized' }, 401);
	}

	// const workspaceId = c.req.header('x-workspace-id');

	// if (!workspaceId) {
	// 	return c.json({ error: 'Workspace ID is required' }, 400);
	// }

	c.set('workspaceId', 'test-workspace-id');

	await next();
});
