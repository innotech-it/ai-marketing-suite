import type { RequestHandler } from './$types';
import { listSkills } from '$lib/projects';

export const GET: RequestHandler = async ({ params }) => {
	const { project } = params;
	const skills = listSkills(project);
	return new Response(JSON.stringify({ skills }), {
		headers: { 'Content-Type': 'application/json' }
	});
};
