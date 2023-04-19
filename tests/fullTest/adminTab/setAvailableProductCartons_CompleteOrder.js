import { check, group } from 'k6';
import { chromium } from 'k6/x/browser';

export function SetAvailableProductCartons_CompleteOrder() {
    const url = 'https://dev.dev.skudrop.com/login';

    const email = 'admin@example.com';
    const password = 'admin';

    const numberOfAvailableCartons = "4";
    
    const cartonsAvailableModalText = "How many cartons are available?";

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
            group('SetAvailableProductCartons_CompleteOrder: Visit login page and authorization', function () {
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
            group('SetAvailableProductCartons_CompleteOrder: Waiting for Warehouse Dashboard page and go to Orders To Prep tab', function () {
                page.waitForSelector('div[aria-label="total-units-stored"] > h1 >> nth=0');

                return Promise.all([
                    page.waitForNavigation(),
                    page.locator('button[id="Dashboard-tab-OrdersToPrep"]').click(),
                ]);
            });
        })
        .then(() => {
            group('WarehouseDasboardTabs: Wait for Orders To Prep tab and click Yes (Completed) button', function () {
                page.waitForSelector('div[aria-label="orders-to-prep-table"]');

                return Promise.all([
                    page.locator('button[name="complete-order"] >> nth=0').click(),
                ]);
            });
        })
        .then(() => {
            group('WarehouseDasboardTabs: Confirm completion order and click Yes button', function () {
                page.waitForSelector('div[aria-label="order-to-prep_confirmation-required-modal"]');

                return Promise.all([
                    page.locator('button[name="confirm-require"]').click(),
                ]);
            });
        })
        .then(() => {
            group('SetAvailableProductCartons_CompleteOrder: Click Yes (Completed) button', function () {
                page.waitForSelector('div[aria-label="orders-to-prep-table"]');
                page.waitForSelector('button[name="complete-order"] >> nth=0');
                page.waitForTimeout(500);

                return Promise.all([
                    page.locator('button[name="complete-order"] >> nth=0').click(),
                ]);
            });
        })
        .then(() => {
            group('SetAvailableProductCartons_CompleteOrder: Click No button', function () {
                page.waitForSelector('div[aria-label="order-to-prep_confirmation-required-modal"]');

                return Promise.all([
                    page.locator('button[name="cancel-require"]').click(),
                ]);
            });
        })
        .then(() => {
            group('SetAvailableProductCartons_CompleteOrder: Fill in number of available cartons and click Advise Customer button', function () {
                page.waitForSelector('div[aria-label="confirmation-required-modal_cartons-available"]');

                check(page, {
                    'SetAvailableProductCartons[1/3]: Warehouse Dashboard: Orders To Prep: Modal (Confirmation Required - Cartons Available) - Modal is visible and content match': page.locator('div[aria-label="confirmation-required-modal_cartons-available"]').isVisible() && page.locator('h5[about="available-cartons-modal-label"]').textContent() == cartonsAvailableModalText,
                    'SetAvailableProductCartons[2/3]: Warehouse Dashboard: Orders To Prep: Modal (Confirmation Required - Cartons Available) - Input (Number of cartons) is visible and editable': page.locator('input[name="NumberOfCartons"]').isVisible() && page.locator('input[name="NumberOfCartons"]').isEditable(),
                    'SetAvailableProductCartons[3/3]: Warehouse Dashboard: Orders To Prep: Modal (Confirmation Required - Cartons Available) - Button (Advise Customer) is visible and enabled': page.locator('button[name="advise-customer"]').isVisible() && page.locator('button[name="advise-customer"]').isEnabled(),
                });

                page.locator('input[name="NumberOfCartons"]').fill('');
                page.locator('input[name="NumberOfCartons"]').fill(numberOfAvailableCartons);

                return Promise.all([
                    page.locator('button[name="advise-customer"]').click(),
                ]);
            });
        })
        .then(() => {
            group('SetAvailableProductCartons_CompleteOrder: Wait for Order To Prep tab', function () {
                page.waitForSelector('div[aria-label="orders-to-prep"]');
            });
        })
        .finally(() => {
            page.close();
            browser.close();
        });
}