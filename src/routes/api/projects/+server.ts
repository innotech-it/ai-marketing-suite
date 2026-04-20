import type { RequestHandler } from './$types';
import { listProjects } from '$lib/projects';

export const GET: RequestHandler = async () => {
	const projects = listProjects();
	return new Response(JSON.stringify({ projects }), {
		headers: { 'Content-Type': 'application/json' }
	});
};
