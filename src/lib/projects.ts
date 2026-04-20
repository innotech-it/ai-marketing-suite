// Project discovery — projects/ bundled inside src/ for Vercel serverless

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function getRootDir(): string {
	// Navigate from src/lib/ up to src/ then projects/
	return path.join(fileURLToPath(new URL('.', import.meta.url)), '..', '..', 'projects');
}

export function getProjectsDir(): string {
	return getRootDir();
}

export function listProjects(): string[] {
	const dir = getProjectsDir();
	if (!fs.existsSync(dir)) return [];
	return fs
		.readdirSync(dir)
		.filter((f) => fs.statSync(path.join(dir, f)).isDirectory());
}

export function getProjectContext(project: string): string {
	const contextDir = path.join(getProjectsDir(), project, 'context');
	if (!fs.existsSync(contextDir)) return '';

	const files = fs.readdirSync(contextDir).filter((f) => f.endsWith('.md'));
	return files
		.map((f) => fs.readFileSync(path.join(contextDir, f), 'utf8'))
		.join('\n\n');
}

export function listSkills(project: string): string[] {
	const skillsDir = path.join(getProjectsDir(), project, 'skills');
	if (!fs.existsSync(skillsDir)) return [];

	return fs
		.readdirSync(skillsDir)
		.filter((f) => f.endsWith('.md'))
		.map((f) => f.replace(/\.md$/, ''));
}

export function getSkill(project: string, skillName: string): string | null {
	const skillFile = path.join(getProjectsDir(), project, 'skills', `${skillName}.md`);
	if (!fs.existsSync(skillFile)) return null;
	return fs.readFileSync(skillFile, 'utf8');
}
