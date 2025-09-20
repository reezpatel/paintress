import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { files } from './modules/files.js';
import { authMiddleware, factory } from './modules/app.js';
import { cors } from 'hono/cors';
import { migrator } from './db/index.js';

const app = new Hono();

app.use('/api/*', cors({ origin: process.env.CORS_ORIGIN || '*' }));

const api = factory.createApp();

api.get('/ping', authMiddleware, (c) => c.json({ success: true, message: 'pong' }));

api.route('/fs', files);

app.route('/api/v1', api);

serve(
	{
		fetch: app.fetch,
		port: Number(process.env.PORT) || 3000,
		hostname: process.env.HOST || '0.0.0.0',
	},
	(info) => {
		console.log(`Server is running on http://${process.env.HOST || '0.0.0.0'}:${info.port}`);
		migrator.migrateToLatest();
	},
);
