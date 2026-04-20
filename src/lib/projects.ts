// Project discovery — uses import.meta.glob with eager raw imports
// Vite bundles all matched files as strings at build time
// Works on Vercel serverless because data is embedded in the JS bundle

// Eager glob = synchronous, bundled at build time
const _contextFiles = import.meta.glob('/src/lib/projects/*/context/*.md', {
	eager: true,
	query: '?raw',
	import: 'default'
}) as Record<string, string>;

const _skillFiles = import.meta.glob('/src/lib/projects/*/skills/*.md', {
	eager: true,
	query: '?raw',
	import: 'default'
}) as Record<string, string>;

export function listProjects(): string[] {
	const projects = new Set<string>();
	for (const p of Object.keys(_contextFiles)) {
		const m = p.match(/\/src\/lib\/projects\/([^/]+)\//);
		if (m) projects.add(m[1]);
	}
	for (const p of Object.keys(_skillFiles)) {
		const m = p.match(/\/src\/lib\/projects\/([^/]+)\//);
		if (m) projects.add(m[1]);
	}
	return Array.from(projects);
}

export function getProjectContext(project: string): string {
	const entries = Object.entries(_contextFiles)
		.filter(([p]) => p.includes(`/projects/${project}/context/`))
		.map(([, c]) => c);
	return entries.join('\n\n');
}

export function listSkills(project: string): string[] {
	return Object.keys(_skillFiles)
		.filter((p) => p.includes(`/projects/${project}/skills/`))
		.map((p) => p.replace(`/src/lib/projects/${project}/skills/`, '').replace('.md', ''));
}

export function getSkill(project: string, skillName: string): string | null {
	const path = `/src/lib/projects/${project}/skills/${skillName}.md`;
	return _skillFiles[path] ?? null;
}
