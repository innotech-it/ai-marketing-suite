import type { RequestHandler } from './$types';
import { getProjectContext, getSkill } from '$lib/projects';
import { callGLM, callMiniMax } from '$lib/llm';

export const POST: RequestHandler = async ({ request }) => {
	let body: any;
	try {
		body = await request.json();
	} catch {
		return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const { project, skillName, llm, input } = body;

	if (!project || !skillName || !llm || !input) {
		return new Response(
			JSON.stringify({ error: 'Missing project / skillName / llm / input' }),
			{ status: 400, headers: { 'Content-Type': 'application/json' } }
		);
	}

	// 1) Load context
	const context = getProjectContext(project);

	// 2) Load skill
	const skillPrompt = getSkill(project, skillName);
	if (skillPrompt === null) {
		return new Response(JSON.stringify({ error: `Skill not found: ${skillName}` }), {
			status: 404,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	// 3) Build final prompt
	const finalPrompt = `Tu es un directeur marketing senior.
Tu suis STRICTEMENT les SOP et la structure du skill ci-dessous.

=== CONTEXTE MARQUE ===
${context}

=== SKILL ===
${skillPrompt}

=== TÂCHE UTILISATEUR ===
${input}`;

	// 4) Call LLM
	let result: string;
	let tokens: number | undefined;

	try {
		if (llm === 'glm') {
			const apiKey = process.env.GLM_API_KEY;
			if (!apiKey) throw new Error('GLM_API_KEY not set');
			const res = await callGLM(finalPrompt, apiKey);
			result = res.result;
			tokens = res.tokens;
		} else if (llm === 'minimax') {
			const apiKey = process.env.MINIMAX_API_KEY;
			if (!apiKey) throw new Error('MINIMAX_API_KEY not set');
			const res = await callMiniMax(finalPrompt, apiKey);
			result = res.result;
			tokens = res.tokens;
		} else {
			return new Response(JSON.stringify({ error: 'Unsupported llm (use glm | minimax)' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}
	} catch (err: any) {
		return new Response(JSON.stringify({ error: err.message }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	return new Response(
		JSON.stringify({
			project,
			skillName,
			llm,
			result,
			tokens,
			timestamp: new Date().toISOString()
		}),
		{ status: 200, headers: { 'Content-Type': 'application/json' } }
	);
};
