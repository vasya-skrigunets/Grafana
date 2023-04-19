import { check, group } from 'k6';
import { chromium } from 'k6/x/browser';

export function UpdateProductDimension() {
    const url = 'https://test.dev.skudrop.com/login';

    const email = 'admin@example.com';
    const password = 'admin';

    const numberOfCartons = "1";
    const productHeigth = "40.00";
    const productHSCode = "12.3456789";

    const storedProductsTableTitle = "Stored products";
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
            group('UpdateProductDimension: Visit login page and authorization', function () {
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
            group('UpdateProductDimension: Waiting for Dashboard page and click on product', function () {
                page.waitForSelector('div[aria-label="total-units-stored"] > h1 >> nth=0');

                check(page, {
                    'UpdateProductDimension[1/5]: Dashboard: Content is visible and matched after login': page.locator('img[alt="LOGO"]').isVisible() && page.locator('div[aria-label="stored-product"] > h5 >> nth=0').textContent() == storedProductsTableTitle,
                });

                return Promise.all([
                    page.locator('tr[about="uploaded-product-field"] >> nth=0').click(),
                ]);
            });
        })
        .then(() => {
            group('UpdateProductDimension: Check Product Details modal and change carton Height', function () {
                page.waitForSelector('div[name="product-details"]');

                check(page, {
                    'UpdateProductDimension[2/5]: Dashboard: Modal (Product Details) - Modal is visible and content matched': page.locator('div[name="product-details"]').isVisible() && page.locator('div.modal-title').textContent() == productDetailsModalTitle,
                    'UpdateProductDimension[3/5]: Dashboard: Modal (Product Details) - Input (Height) is editable': page.locator('input[name="height"]').isEditable(),
                    'UpdateProductDimension[4/5]: Dashboard: Modal (Product Details) - Input (HS Code) is editable': page.locator('input[name="hs_code_0"]').isEditable(),
                    'UpdateProductDimension[5/5]: Dashboard: Modal (Product Details) - Button (Save) is visible and enabled': page.locator('button[name="save-product"]').isVisible() && page.locator('button[name="save-product"]').isEnabled(),
                });

                page.locator('input[name="height"]').fill('');
                page.locator('input[name="height"]').fill(productHeigth);
                page.locator('input[name="hs_code_0"]').fill('');
                page.locator('input[name="hs_code_0"]').fill(productHSCode);

                return Promise.all([
                    page.locator('button[name="save-product"]').click(),
                ]);
            });
        })
        .then(() => {
            group('UpdateProductDimension: Wait Dasboard and redirect to Send Product To SKUdrop page', function () {
                page.waitForSelector('div[aria-label="total-units-stored"] > h1 >> nth=0');

                return Promise.all([
                    page.waitForNavigation(),
                    page.locator('a[href="/dashboard/send-product"]').click(),
                ]);
            });
        })
        .then(() => {
            group('UpdateProductDimension: Wait Send Product To SKUdrop page and fill in Master Cartons value', function () {
                page.waitForSelector('label[aria-label="send-product-to-skudrop-title"]');

                page.locator('input[name="Skudrop-001"] >> nth=0').fill('');
                page.locator('input[name="Skudrop-001"] >> nth=0').type(numberOfCartons);

                return Promise.all([
                    page.locator('button[name="confirm-incoming-shipment"]').click(),
                ]);
            });
        })
        .then(() => {
            group('UpdateProductDimension: Check acknowledge confirmation and click Submit button', function () {
                page.waitForSelector('div[aria-label="confirm-incoming-shipment-details-modal"]');

                page.locator('input[name="check"]').check();

                return Promise.all([
                    page.locator('button[name="submit-confirmation"]').click(),
                ]);
            });
        })
        .then(() => {
            group('UpdateProductDimension: Wait Information modal and redirect to Dashboard', function () {
                page.waitForSelector('div[aria-label="skudrop-waiting-cartons-modal"]', { timeout: 10000 });

                return Promise.all([
                    page.waitForNavigation(),
                    page.locator('button[name="go-to-dashboard"]').click(),
                ]);
            });
        })
        .finally(() => {
            page.close();
            browser.close();
        });
}