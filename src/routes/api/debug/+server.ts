import type { RequestHandler } from './$types';
import fs from 'node:fs';
import path from 'node:path';

export const GET: RequestHandler = async () => {
	const debug = {
		processCwd: process.cwd(),
		projectsAtCwd: fs.existsSync(path.join(process.cwd(), 'projects')),
		projectsAtVarTask: fs.existsSync('/var/task/projects'),
		varTaskListing: fs.readdirSync('/var/task').filter(f => !f.startsWith('.')).slice(0, 20),
	};

	return new Response(JSON.stringify(debug, null, 2), {
		headers: { 'Content-Type': 'application/json' }
	});
};
