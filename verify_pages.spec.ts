
import { test, expect } from '@playwright/test';

test('verify new pages', async ({ page }) => {
  await page.goto('/our-programs/mentorship-incubation');
  await page.screenshot({ path: 'mentorship-incubation.png' });

  await page.goto('/scholarship/how-to-apply');
  await page.screenshot({ path: 'how-to-apply.png' });

  await page.goto('/scholarship/resources');
  await page.screenshot({ path: 'resources.png' });

  await page.goto('/scholarship/faq');
  await page.screenshot({ path: 'faq.png' });
});
