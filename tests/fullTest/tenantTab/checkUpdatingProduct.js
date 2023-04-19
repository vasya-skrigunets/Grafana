import { check, group } from 'k6';
import { chromium } from 'k6/x/browser';

export function CheckUpdatingProduct() {
    const url = 'https://test.dev.skudrop.com/login';

    const email = 'admin@example.com';
    const password = 'admin';

    const oldHeigth = "38 cm";
    const newHeigth = "40 cm";

    const productDetailsModalTitle = "Product Details";

    const browser = chromium.launch({
        headless: true,
    });

    const context = browser.newContext({
        ignoreHTTPSErrors: true,
    });

    context.setDefaultTimeout(60000);
    context.setDefaultNavigationTimeout(60000);

    const page = context.newPage();

    page.goto(url, { waitUntil: 'networkidle' })
        .then(() => {
            group('CheckUpdatingProduct: Visit login page and authorization', function () {
                page.waitForSelector('h4[aria-label="login-page-title"]');

                page.locator('input[name="email"]').fill(email);
                page.locator('input[name="password"]').fill(password);

                return Promise.all([
                    page.waitForNavigation(),
                    page.locator('button[name="login-page_login-button"]').click(),
                ]);
            });
        })
        .then(() => {
            group('CheckUpdatingProduct: Waiting for Dashboard page and click on stored product', function () {
                page.waitForSelector('div[aria-label="total-units-stored"] > h1 >> nth=0');

                return Promise.all([
                    page.locator('tr[about="stored-product-field"] >> nth=-1').click(),
                ]);
            });
        })
        .then(() => {
            group('CheckUpdatingProduct: Check Product Details modal', function () {
                page.waitForSelector('div[name="product-details"]');
                page.waitForTimeout(1000);

                check(page, {
                    'CheckUpdatingProduct[1/3]: Dashboard: Modal (Product Details) - Modal is visible and content matched': page.locator('div[name="product-details"]').isVisible() && page.locator('div.modal-title').textContent() == productDetailsModalTitle,
                    'CheckUpdatingProduct[2/3]: Dashboard: Modal (Product Details) - Old Height is correct': page.locator('td[about="product-height"] >> nth=0').textContent() == oldHeigth,
                    'CheckUpdatingProduct[3/3]: Dashboard: Modal (Product Details) - New Height is correct': page.locator('td[about="product-height"] >> nth=-1').textContent() == newHeigth,
                });
            });
        })
        .finally(() => {
            page.close();
            browser.close();
        });
}