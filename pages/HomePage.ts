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
    await card.scrollIntoViewIfNeeded();
    await card.hover();
    await this.addToCartButton(productId).click();
  }

  // This theme confirms cart additions via a Bootstrap toast
  // (role="alert"); there is no dedicated success banner element.
  successToast(): Locator {
    return this.page.locator('[role="alert"].toast');
  }

  async verifyProductAddedToCart(): Promise<void> {
    await expect(this.successToast()).toBeVisible();
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