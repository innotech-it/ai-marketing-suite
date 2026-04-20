import type { RequestHandler } from './$types';
import fs from 'node:fs';

export const GET: RequestHandler = async () => {
	const paths = [
		'/var/task/projects',
		'/var/task/src/projects',
		'/var/task/.svelte-kit/output/server/entries/projects',
		process.cwd() + '/projects',
		process.cwd() + '/src/projects',
	];

	const debug: Record<string, any> = {
		processCwd: process.cwd(),
		filesInTask: fs.readdirSync('/var/task').slice(0, 30),
	};

	for (const p of paths) {
		debug[p] = { exists: fs.existsSync(p) };
		if (fs.existsSync(p)) {
			try {
				debug[p].listing = fs.readdirSync(p).slice(0, 5);
			} catch {}
		}
	}

	return new Response(JSON.stringify(debug, null, 2), {
		headers: { 'Content-Type': 'application/json' }
	});
};
