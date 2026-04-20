<script lang="ts">
	import { onMount } from 'svelte';

	interface RunResponse {
		project: string;
		skillName: string;
		llm: string;
		result: string;
		tokens?: number;
		timestamp: string;
	}

	let projects: string[] = [];
	let skills: string[] = [];
	let selectedProject = '';
	let selectedSkill = '';
	let selectedLlm = 'minimax';
	let userInput = '';
	let output = '';
	let loading = false;
	let error = '';
	let elapsed = 0;
	let timer: ReturnType<typeof setInterval> | null = null;

	onMount(async () => {
		const res = await fetch('/api/projects');
		if (res.ok) {
			const data = await res.json();
			projects = data.projects;
			if (projects.length > 0) {
				selectedProject = projects[0];
			}
		}
	});

	async function loadSkills() {
		if (!selectedProject) return;
		const res = await fetch(`/api/projects/${selectedProject}/skills`);
		if (res.ok) {
			const data = await res.json();
			skills = data.skills;
			selectedSkill = skills[0] || '';
		}
	}

	$: if (selectedProject) loadSkills();

	async function runSkill() {
		if (!selectedProject || !selectedSkill || !selectedLlm || !userInput.trim()) return;

		loading = true;
		error = '';
		output = '';
		elapsed = 0;

		timer = setInterval(() => elapsed++, 1000);

		const start = Date.now();
		try {
			const res = await fetch('/api/run-skill', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					project: selectedProject,
					skillName: selectedSkill,
					llm: selectedLlm,
					input: userInput
				})
			});

			const data = await res.json();

			if (!res.ok) {
				error = data.error || 'Unknown error';
			} else {
				output = data.result;
			}
		} catch (e: any) {
			error = e.message;
		} finally {
			loading = false;
			if (timer) clearInterval(timer);
			elapsed = Math.round((Date.now() - start) / 1000);
		}
	}
</script>

<svelte:head>
	<title>AI Marketing Suite</title>
</svelte:head>

<div class="app">
	<header>
		<h1>AI Marketing Suite</h1>
		<p class="subtitle">Skills marketing IA — InnoTech-IT</p>
	</header>

	<main>
		<div class="panel left">
			<h2>Configuration</h2>

			<label>
				Projet
				<select bind:value={selectedProject}>
					{#each projects as p}
						<option value={p}>{p}</option>
					{/each}
				</select>
			</label>

			<label>
				Skill
				<select bind:value={selectedSkill}>
					{#each skills as s}
						<option value={s}>{s}</option>
					{/each}
				</select>
			</label>

			<label>
				LLM
				<div class="llm-toggle">
					<button
						class:active={selectedLlm === 'minimax'}
						on:click={() => (selectedLlm = 'minimax')}
					>
						MiniMax
					</button>
					<button
						class:active={selectedLlm === 'glm'}
						on:click={() => (selectedLlm = 'glm')}
					>
						GLM
					</button>
				</div>
			</label>

			<label>
				Brief / Input
				<textarea
					bind:value={userInput}
					placeholder="Décris la tâche à effectuer..."
					rows={6}
				></textarea>
			</label>

			<button class="run-btn" on:click={runSkill} disabled={loading || !selectedSkill}>
				{loading ? 'Running...' : '▶ Run Skill'}
			</button>

			{#if loading}
				<div class="timer">{elapsed}s</div>
			{/if}
		</div>

		<div class="panel right">
			<div class="output-header">
				<h2>Output</h2>
				{#if output && elapsed}
					<span class="meta">{elapsed}s</span>
				{/if}
			</div>

			{#if error}
				<div class="error-box">
					<strong>Error:</strong> {error}
				</div>
			{/if}

			{#if output}
				<pre class="output">{output}</pre>
			{/if}
		</div>
	</main>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		background: #0a0a0a;
		color: #e0e0e0;
		font-family: 'Inter', system-ui, sans-serif;
	}

	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	header {
		padding: 1.5rem 2rem;
		border-bottom: 1px solid #222;
	}

	h1 {
		margin: 0;
		font-size: 1.4rem;
		font-weight: 600;
		color: #fff;
	}

	.subtitle {
		margin: 0.25rem 0 0;
		font-size: 0.85rem;
		color: #666;
	}

	main {
		display: grid;
		grid-template-columns: 360px 1fr;
		gap: 1px;
		background: #222;
		flex: 1;
	}

	.panel {
		background: #0a0a0a;
		padding: 1.5rem;
	}

	.panel.left {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.panel.right {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	h2 {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #666;
		margin: 0;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		font-size: 0.85rem;
		color: #999;
	}

	select,
	textarea {
		background: #141414;
		border: 1px solid #2a2a2a;
		color: #e0e0e0;
		border-radius: 4px;
		padding: 0.5rem;
		font-family: inherit;
		font-size: 0.85rem;
	}

	select:focus,
	textarea:focus {
		outline: none;
		border-color: #3b82f6;
	}

	textarea {
		resize: vertical;
		font-family: 'JetBrains Mono', monospace;
	}

	.llm-toggle {
		display: flex;
		gap: 0.5rem;
	}

	.llm-toggle button {
		flex: 1;
		padding: 0.4rem;
		background: #141414;
		border: 1px solid #2a2a2a;
		color: #666;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.85rem;
		transition: all 150ms ease-out;
	}

	.llm-toggle button.active {
		background: #1e3a5f;
		border-color: #3b82f6;
		color: #fff;
	}

	.run-btn {
		margin-top: 0.5rem;
		padding: 0.7rem;
		background: #3b82f6;
		color: #fff;
		border: none;
		border-radius: 4px;
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 150ms ease-out;
	}

	.run-btn:hover:not(:disabled) {
		background: #2563eb;
	}

	.run-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.timer {
		text-align: center;
		font-size: 0.8rem;
		color: #666;
		font-variant-numeric: tabular-nums;
	}

	.output-header {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.meta {
		font-size: 0.75rem;
		color: #22c55e;
		font-variant-numeric: tabular-nums;
	}

	.error-box {
		background: #1f0a0a;
		border: 1px solid #ef4444;
		color: #ef4444;
		padding: 0.75rem;
		border-radius: 4px;
		font-size: 0.85rem;
	}

	.output {
		background: #0d0d0d;
		border: 1px solid #222;
		border-radius: 4px;
		padding: 1rem;
		overflow: auto;
		white-space: pre-wrap;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.8rem;
		line-height: 1.6;
		color: #ccc;
		flex: 1;
		max-height: calc(100vh - 200px);
	}
</style>
