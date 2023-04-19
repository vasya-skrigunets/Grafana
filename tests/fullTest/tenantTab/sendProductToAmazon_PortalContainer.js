import { group } from 'k6';
import { chromium } from 'k6/x/browser';

export function SendProductToAmazon_PortalContainer() {
    const url = 'https://test.dev.skudrop.com/login';

    const email = 'admin@example.com';
    const password = 'admin';

    const numberOfCartons = "1";

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
            group('SendProductToAmazon_PortalContainer: Visit login page and authorization', function () {
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
            group('SendProductToAmazon_PortalContainer: Waiting for Dashboard page and go to Send Product To Amazon page', function () {
                page.waitForSelector('div[aria-label="total-units-stored"] > h1 >> nth=0');

                return Promise.all([
                    page.waitForNavigation(),
                    page.locator('a[href="/dashboard/send-product-to-amazon"]').click(),
                ]);
            });
        })
        .then(() => {
            group('SendProductToAmazon_PortalContainer: Fill in number of cartons and click Create Shipping Plan button', function () {
                page.waitForSelector('input[name="0be3a60e-b103-4af2-b52e-fad63df756c3"]');

                page.locator('input[name="0be3a60e-b103-4af2-b52e-fad63df756c3"]').fill('');
                page.locator('input[name="0be3a60e-b103-4af2-b52e-fad63df756c3"]').type(numberOfCartons);

                return Promise.all([
                    page.locator('button[name="create-shipping-plan-with-seller-central"]').click(),
                ]);
            });
        })
        .then(() => {
            group('SendProductToAmazon_PortalContainer: Click Calculate Shipping Estimate button', function () {
                page.waitForSelector('button[name="calculate-shipping-estimate"]');

                return Promise.all([
                    page.locator('button[name="calculate-shipping-estimate"]').click(),
                ]);
            });
        })
        .then(() => {
            group('SendProductToAmazon_PortalContainer: Check Slow Boat (UPS delivery) checkbox and click Confirm Shipping Plan button', function () {
                page.waitForSelector('input[name="delivery_type_Truck delivery_Regular"]');

                page.locator('input[name="delivery_type_Truck delivery_Regular"]').check();

                page.waitForSelector('button[name="confirm-shipping-plan"]');

                return Promise.all([
                    page.locator('button[name="confirm-shipping-plan"]').click(),
                ]);
            });
        })
        .then(() => {
            group('SendProductToAmazon_PortalContainer: Wait for All Done modal and click Go To Dashboard button', function () {
                page.waitForSelector('button[name="go-to-dashboard"]');

                return Promise.all([
                    page.waitForNavigation(),
                    page.locator('button[name="go-to-dashboard"]').click(),
                ]);
            });
        })
        .then(() => {
            group('SendProductToAmazon_PortalContainer: Wait for Dashboard page', function () {
                page.waitForSelector('button[id="Dashboard-tab-TotalStorage"]');
            });
        })
        .finally(() => {
            page.close();
            browser.close();
        });
}