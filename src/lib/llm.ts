// LLM call wrappers — GLM (Zhipu) + MiniMax

export interface LLMResponse {
	result: string;
	tokens?: number;
}

export async function callGLM(prompt: string, apiKey: string): Promise<LLMResponse> {
	const res = await fetch('https://api.zhipu.ai/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`
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
	const res = await fetch('https://api.minimax.chat/v1/text/chatcompletion', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`
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
