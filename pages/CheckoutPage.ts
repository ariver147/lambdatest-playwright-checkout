import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyCheckoutPageReached(): Promise<void> {
    await expect(this.page).toHaveURL(/route=checkout\/checkout/);
  }

  // Scoped to #content and matched by product_id in the link href —
  // a stable data identifier, rather than a display name or CSS
  // class that could change or repeat across products.
  productRow(productId: string): Locator {
    return this.page
      .locator('#content')
      .locator(`tr:has(a[href*="product_id=${productId}"])`);
  }

  async verifyProductInCheckout(productId: string): Promise<void> {
    await expect(this.productRow(productId)).toBeVisible();
  }
}