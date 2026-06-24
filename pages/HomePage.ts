import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Scoped to the product card containing the add-to-cart button for
  // this specific product ID. .filter({ visible: true }) is required
  // because the homepage carousel renders the same product across
  // multiple hidden swiper clones/tabs, which would otherwise cause
  // strict-mode violations or attempts to interact with hidden elements.
  productThumb(productId: string): Locator {
    return this.page
      .locator(`.product-thumb:has(.btn-cart.cart-${productId})`)
      .filter({ visible: true })
      .first();
  }

  addToCartButton(productId: string): Locator {
    return this.productThumb(productId).locator(`.btn-cart.cart-${productId}`);
  }

  async addProductToCart(productId: string): Promise<void> {
    const card = this.productThumb(productId);

    // Ensure the card is visible and hovered
    await card.scrollIntoViewIfNeeded();
    await card.hover();

    const button = this.addToCartButton(productId);

    // Wait until the button is visible
    await button.waitFor({ state: 'visible' });

    // Small delay to let sticky headers/animations settle
    await this.page.waitForTimeout(500);

    // Perform a normal click (no force, no bounding box)
    await button.click();
  }




  // This theme confirms cart additions via a Bootstrap toast
  // (role="alert"); there is no dedicated success banner element.
  successToast(): Locator {
    return this.page.locator('.toast, .alert-success, [role="alert"]');
  }



  async verifyProductAddedToCart(): Promise<void> {
    const toast = this.successToast();

    // Wait longer, since Bootstrap toasts can be delayed or very brief
    await expect(toast).toBeVisible({ timeout: 3000 });

    // Optionally, also assert that it eventually disappears (realistic behavior)
    await expect(toast).toHaveCount(0, { timeout: 3000 }).catch(() => { });
  }


  // "Checkout" link inside the toast's cart popup. This navigates
  // directly to the checkout page on this site.
  checkoutLinkInToast(): Locator {
    return this.page.getByRole('link', { name: 'Checkout' }).filter({ visible: true }).first();
  }

  async goToCheckoutFromToast(): Promise<void> {
    await this.checkoutLinkInToast().click();
  }
}