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

	const apiKey = authToken.replace('Bearer ', '').trim().slice(200);

	if (apiKey !== process.env.API_KEY) {
		return c.json({ message: 'Unauthorized' }, 401);
	}

	c.set('workspaceId', '01ARZ3NDEKTSV4RRFFQ69G5FAV');

	await next();
});
