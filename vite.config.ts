import { paraglide } from '@inlang/paraglide-sveltekit/vite'
import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
	plugins: [paraglide({ project: './project.inlang', outdir: './src/lib/paraglide' }),sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		environment: "jsdom",
		globals: true,
		setupFiles:"src/setupTest.ts",
	}
};

export default config;
