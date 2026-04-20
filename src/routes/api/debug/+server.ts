import type { RequestHandler } from './$types';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

export const GET: RequestHandler = async () => {
	const importUrl = new URL('.', import.meta.url);
	const rootDir = fileURLToPath(importUrl);
	const projectsDir = path.join(rootDir, '..', '..', 'projects');
	const srcProjectsDir = path.join(process.cwd(), 'src', 'projects');

	const debug = {
		importMetaUrl: importUrl.toString(),
		rootDir,
		processCwd: process.cwd(),
		projectsDir,
		srcProjectsDir,
		projectsDirExists: fs.existsSync(projectsDir),
		srcProjectsDirExists: fs.existsSync(srcProjectsDir),
		srcProjectsExists: fs.existsSync('/var/task/src/projects'),
		listing: fs.existsSync(projectsDir) ? fs.readdirSync(projectsDir) : null,
	};

	return new Response(JSON.stringify(debug, null, 2), {
		headers: { 'Content-Type': 'application/json' }
	});
};
