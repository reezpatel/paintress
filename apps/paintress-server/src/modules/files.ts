import { db } from '../db/index.js';
import { storage } from '../utils/s3.js';
import { authMiddleware, factory } from './app.js';
import { ulid } from 'ulid';

export const files = factory.createApp();

files.use('*', authMiddleware);

files.get('summary', async (c) => {
	const workspaceId = c.get('workspaceId');

	const result = await db
		.selectFrom('files')
		.select(['file_id', 'file_size', 'file_path', 'deleted', 'updated_at', 's3_hash', 'deleted_at', 'created_at'])
		.where('workspace_id', '=', workspaceId)
		.execute();

	return c.json({ files: result });
});

files.post('/', async (c) => {
	const workspaceId = c.get('workspaceId');
	const body = await c.req.parseBody();

	const { file, isDeleted, filePath, previousUpdatedAt, updatedAt } = body;

	console.log({ isDeleted, filePath, previousUpdatedAt, updatedAt, workspaceId });

	const existingFile = await db
		.selectFrom('files')
		.select(['file_id', 's3_path', 'updated_at'])
		.where('file_path', '=', filePath as string)
		.where('workspace_id', '=', workspaceId)
		.executeTakeFirst();

	if (existingFile && existingFile.updated_at !== Number(previousUpdatedAt as string)) {
		return c.json({ error: 'File has been updated since the last sync' }, 400);
	}

	if ((typeof isDeleted === 'string' && isDeleted === 'true') || (typeof isDeleted === 'boolean' && isDeleted)) {
		if (!existingFile) {
			return c.json({ error: 'File does not exist' }, 400);
		}

		await storage.deleteFile(existingFile.s3_path);

		await db
			.updateTable('files')
			.set({ deleted: 1, s3_path: '', s3_hash: '', updated_at: Number(updatedAt as string), deleted_at: Number(updatedAt as string) })
			.where('file_path', '=', filePath as string)
			.where('workspace_id', '=', workspaceId)
			.execute();

		return c.json({ success: true });
	}

	let fileId = existingFile ? existingFile.file_id : ulid();

	const { s3_path, s3_hash, file_size } = await storage.uploadFile(workspaceId, filePath as string, await(file as File).arrayBuffer());

	if (existingFile) {
		await db
			.updateTable('files')
			.where('file_path', '=', filePath as string)
			.where('workspace_id', '=', workspaceId)
			.set({
				s3_path: s3_path,
				s3_hash: s3_hash,
				s3_size: file_size,
				file_size: file_size,
				updated_at: Number(updatedAt as string),
			})
			.execute();
	} else {
		console.log('inserting', {
			file_id: fileId,
			file_path: filePath as string,
			workspace_id: workspaceId,
			s3_path: s3_path,
			s3_hash: s3_hash,
			s3_size: file_size,
			file_size: file_size,
			deleted: 0,
			updated_at: Number(updatedAt as string),
			deleted_at: 0,
			created_at: Number(updatedAt as string),
		});
		await db
			.insertInto('files')
			.values({
				file_id: ulid(),
				file_path: filePath as string,
				workspace_id: workspaceId,
				s3_path: s3_path,
				s3_hash: s3_hash,
				s3_size: file_size,
				file_size: file_size,
				deleted: 0,
				updated_at: Number(updatedAt as string),
				deleted_at: 0,
				created_at: Number(updatedAt as string),
			})
			.execute();
	}

	return c.json({ success: true });
});

files.get('/file/:fileId', async (c) => {
	const fileId = c.req.param('fileId');
	const workspaceId = c.get('workspaceId');

	const fileResult = await db
		.selectFrom('files')
		.select(['s3_path', 's3_size', 'file_path'])
		.where('file_id', '=', fileId)
		.where('workspace_id', '=', workspaceId)
		.executeTakeFirst();

	if (!fileResult) {
		return c.json({ error: 'File not found' }, 404);
	}

	const file = await storage.downloadFile(fileResult.s3_path);

	if ('redirectTo' in file) {
		return c.redirect(file.redirectTo, 302);
	}

	const arrayBuffer = new Uint8Array(file);

	const fileName = fileResult.file_path.split('/').pop();

	return c.body(arrayBuffer, 200, {
		'Content-Type': 'application/octet-stream',
		'Content-Disposition': `attachment; filename="${fileName}"`,
		'Content-Length': fileResult.s3_size.toString(),
	});
});
