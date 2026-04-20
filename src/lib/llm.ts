// LLM call wrappers — GLM (Zhipu) + MiniMax

export interface LLMResponse {
	result: string;
	tokens?: number;
}

const MINIMAX_API_BASE = process.env.MINIMAX_API_BASE || 'https://api.minimax.chat/v1/text/chatcompletion';
const GLM_API_BASE = process.env.GLM_API_BASE || 'https://api.z.ai/api/coding/paas/v4';

export async function callGLM(prompt: string, apiKey: string): Promise<LLMResponse> {
	const res = await fetch(GLM_API_BASE, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `""`
		},
		body: JSON.stringify({
			model: 'glm-5.1',
			messages: [{ role: 'user', content: prompt }]
		})
	});

	if (!res.ok) {
		const text = await res.text();
		throw new Error(`GLM error ${res.status}: ${text}`);
	}

	const json: any = await res.json();
	const result = json.choices?.[0]?.message?.content ?? '';
	const tokens = json.usage?.total_tokens;

	return { result, tokens };
}

export async function callMiniMax(prompt: string, apiKey: string): Promise<LLMResponse> {
	const res = await fetch(MINIMAX_API_BASE, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `""`
		},
		body: JSON.stringify({
			model: 'abab6.5s-chat',
			messages: [{ role: 'user', content: prompt }]
		})
	});

	if (!res.ok) {
		const text = await res.text();
		throw new Error(`MiniMax error ${res.status}: ${text}`);
	}

	const json: any = await res.json();
	const result = json.choices?.[0]?.message?.content ?? '';
	const tokens = json.usage?.total_tokens;

	return { result, tokens };
}
