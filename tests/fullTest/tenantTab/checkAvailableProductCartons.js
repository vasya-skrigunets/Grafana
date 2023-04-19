import { check, group } from 'k6';
import { chromium } from 'k6/x/browser';

export function CheckAvailableProductCartons() {
    const url = 'https://test.dev.skudrop.com/login';

    const email = 'admin@example.com';
    const password = 'admin';

    const numberOfAvailableCartons = "4"; //SKUdrop-002

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
            group('CheckAvailableProductCartons: Visit login page and authorization', function () {
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
            group('CheckAvailableProductCartons: Waiting for Dashboard page and go to Send Product To Amazon page', function () {
                page.waitForSelector('div[aria-label="total-units-stored"] > h1 >> nth=0');

                return Promise.all([
                    page.waitForNavigation(),
                    page.locator('a[href="/dashboard/send-product-to-amazon"]').click(),
                ]);
            });
        })
        .then(() => {
            group('CheckAvailableProductCartons: Check available number of cartons', function () {
                page.waitForSelector('input[aria-label="Default select example"] >> nth=0');

                check(page, {
                    'CheckAvailableProductCartons[1/1]: Send Product To Amazon: Number of available cartons is equal to the assigned value': page.locator('div[aria-label="SKUdrop-002_available-cartons"]').textContent() == numberOfAvailableCartons,
                });
            });
        })
        .finally(() => {
            page.close();
            browser.close();
        });
}