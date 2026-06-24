import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { testData } from '../data/testData';

test('E-Commerce Checkout Flow › user can add a product to cart and reach checkout', async ({ page, context }) => {
  // Start from a clean cart each run — this storefront persists cart
  // state via cookies, so a fresh browser context avoids items
  // accumulating across repeated runs.
  await context.clearCookies();

  const homePage = new HomePage(page);
  const checkoutPage = new CheckoutPage(page);

  await page.goto('/');

  const { productId } = testData;

  // 1-2. Select an available product and add it to the cart
  await homePage.addProductToCart(productId);

  // 3-4. Validate the product was added successfully
  await homePage.verifyProductAddedToCart();

  // 5. Proceed toward checkout via the toast's Checkout link
  await homePage.goToCheckoutFromToast();

  // 6. Validate the checkout page is reached, with the correct
  //    product carried through from the cart
  await checkoutPage.verifyCheckoutPageReached();
  await checkoutPage.verifyProductInCheckout(productId);
});