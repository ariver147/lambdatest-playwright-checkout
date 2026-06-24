# E-Commerce Checkout Flow Automation

## Objective
Automated test validating a basic e-commerce shopping flow: selecting
a product, adding it to the cart, and proceeding until the checkout
page is reached — without completing checkout or placing an order.

## Tool / Language / Framework
- [Playwright](https://playwright.dev/) with TypeScript
- Page Object Model: `HomePage`, `CheckoutPage`
- Centralized test data: `data/testData.ts`

## Project Structure
pages/
HomePage.ts       # Homepage interactions: add to cart, success toast, checkout link
CheckoutPage.ts    # Checkout page assertions: URL reached, product listed
data/
testData.ts        # Fixed test data (product ID)
tests/
checkout.spec.ts   # The test scenario
## Setup & Run
```bash
npm install
npx playwright install
npx playwright test
```

To view a detailed HTML report after a run:
```bash
npx playwright show-report
```

## Scenario Covered
1. Open the LambdaTest playground homepage
   (`https://ecommerce-playground.lambdatest.io/`).
2. Select an available product (fixed product ID `47` — HP LP3065).
3. Add it to the shopping cart.
4. Validate the product was added successfully, via the cart
   confirmation toast.
5. Proceed toward checkout, using the toast's "Checkout" link.
6. Validate the checkout page is reached (URL matches
   `route=checkout/checkout`) and that the correct product carried
   through, matched by `product_id` in the cart table.
7. Test stops at this point — no personal details are filled in, no
   payment information is entered, and no order is placed.

## Assumptions & Tradeoffs
- **Fixed product ID (47):** chosen for reproducibility over
  dynamically selecting "any available product." This product was
  confirmed to have a stable, enabled checkout path on this
  playground instance.
- **Fresh cart per run:** cookies are cleared at the start of the
  test, since this site persists cart state across browser sessions;
  without this, item counts would accumulate across repeated runs.
- **Direct navigation to checkout:** the toast's "Checkout" link
  navigates straight to the checkout page on this site (no
  intermediate cart-review step is required to satisfy the flow).
- **Selector strategy:** product identification is anchored on
  `product_id` in link `href` attributes wherever possible — a real
  data attribute, since this site has no `data-testid` hooks. The
  add-to-cart button is matched via a CSS class (`.btn-cart.cart-{id}`)
  that embeds the product ID; this is the one selector tied to
  current theme markup rather than pure data, and would need
  updating if the playground's theme changes its button class naming.
- **No linter configured:** kept the setup minimal for this exercise's
  scope. Note for reviewers: assertions are wrapped inside Page
  Object methods (e.g. `verifyProductAddedToCart`,
  `verifyCheckoutPageReached`) rather than inlined in the test body —
  a static linter without custom config (e.g. `expect-expect` from
  eslint-plugin-playwright) would flag these as "no assertion," which
  is a false positive given the Page Object Model pattern.
- **No CAPTCHA/bot-protection bypass attempted, no real purchase or
  payment details submitted, no private account used** — none were
  required or encountered for this flow.
  - **Forced scroll before hover/click:** a sticky header on this site
  intermittently overlapped the add-to-cart button mid-interaction,
  causing Playwright's stability check to fail. Explicitly scrolling
  the product card into view before hovering resolved this reliably.