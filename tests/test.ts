import { expect, test } from '@playwright/test';

test('index page has expected goto login', async ({ page }) => {
	await page.goto('/');
	// expect(page.url()).toContain('/login');
	expect(await page.textContent('h2')).toBe('Bienvenido');
});
