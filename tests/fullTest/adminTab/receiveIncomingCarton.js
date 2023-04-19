import { group } from 'k6';
import { chromium } from 'k6/x/browser';

export function ReceiveIncomingCarton() {
    const url = 'https://dev.dev.skudrop.com/login';

    const email = 'admin@example.com';
    const password = 'admin';

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
            group('ReceiveIncomingCarton: Visit login page and authorization', function () {
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
            group('ReceiveIncomingCarton: Click Received button', function () {
                page.waitForSelector('div[aria-label="total-units-stored"] > h1 >> nth=0');

                return Promise.all([
                    page.locator('button[name="received-order"] >> nth=-1').click(),
                ]);
            });
        })
        .then(() => {
            group('ReceiveIncomingCarton: Wait modal and click Received button', function () {
                page.waitForSelector('div[aria-label="confirm-cartons-received"]');

                return Promise.all([
                    page.locator('button[name="confirm-received-cartons"]').click(),
                ]);
            });
        })
        .then(() => {
            group('ReceiveIncomingCarton: Wait Warehouse Dasboard page', function () {
                page.waitForSelector('div[aria-label="total-units-stored"] > h1 >> nth=0');
            });
        })
        .finally(() => {
            page.close();
            browser.close();
        });
}