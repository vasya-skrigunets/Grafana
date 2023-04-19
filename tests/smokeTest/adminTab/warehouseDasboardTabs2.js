import { check, group } from 'k6';
import { chromium } from 'k6/x/browser';

export function WarehouseDasboardTabs2() {
    const url = 'https://dev.dev.skudrop.com/login';

    const email = 'admin@example.com';
    const password = 'admin';

    const tariffAmount = '23.23';

    const manageTariffsAndTaxesTableTitle = "Manage tariffs and taxes";
    const chargeTariffAmountModalTitle = "CHARGE TARIFF AMOUNT FOR";

    const browser = chromium.launch({
        headless: true,
    });

    const context = browser.newContext({
        ignoreHTTPSErrors: true,
        viewport: { width: 1400, height: 900 }
    });

    context.setDefaultTimeout(60000);
    context.setDefaultNavigationTimeout(60000);

    const page = context.newPage();


    page.goto(url, { waitUntil: 'networkidle' })
        .then(() => {
            group('WarehouseDasboardTabs2: Visit login page and authorization', function () {
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
            group('WarehouseDasboardTabs2: Waiting for Warehouse Dashboard page, record delivery statistics and redirecting to Tariff Managment tab', function () {
                page.waitForSelector('div[aria-label="total-units-stored"] > h1 >> nth=0');

                return Promise.all([
                    page.waitForNavigation(),
                    page.locator('button[id="Dashboard-tab-TariffManagement"]').click(),
                ]);
            });
        })
        .then(() => {
            group('WarehouseDasboardTabs2: Check Tariff Managment tab, fill in tariff value and click Save button', function () {
                page.waitForSelector('div[aria-label="manage-tariffs-and-taxes-table"]');
                page.waitForTimeout(1000);

                check(page, {
                    'WarehouseDasboardTabs[32/42]: Tariff managment: Window is visible and content match': page.locator('div[aria-label="manage-tariffs-and-taxes-table"]').isVisible() && page.locator('div[aria-label="manage-tariffs-and-taxes-table"] > h5').textContent() == manageTariffsAndTaxesTableTitle,
                    'WarehouseDasboardTabs[33/42]: Tariff managment: Button (Upload Tariff Sheet) is visible and enabled': page.locator('button[name="upload-tariff-sheet"]').isVisible() && page.locator('button[name="upload-tariff-sheet"]').isEnabled(),
                    'WarehouseDasboardTabs[34/42]: Tariff managment: Button (Charge All) is visible and disabled': page.locator('button[name="charge-all"]').isVisible() && page.locator('button[name="charge-all"]').isDisabled(),
                    'WarehouseDasboardTabs[35/42]: Tariff managment: Input (Tariff Amount) is visible and editable': page.locator('input[aria-label="order-tariff-amount"] >> nth=0').isVisible() && page.locator('input[aria-label="order-tariff-amount"] >> nth=0').isEditable(),
                    'WarehouseDasboardTabs[36/42]: Tariff managment: Button (Save Tariff) is visible and enabled': page.locator('button[name="save-order-tariff-amount"] >> nth=0').isVisible() && page.locator('button[name="save-order-tariff-amount"] >> nth=0').isEnabled(),
                    'WarehouseDasboardTabs[37/42]: Tariff managment: Button (Charge Tariff) is visible and disabled': page.locator('button[name="charge-order-tariff"] >> nth=0').isVisible() && page.locator('button[name="charge-order-tariff"] >> nth=0').isDisabled(),
                });

                page.locator('input[aria-label="order-tariff-amount"] >> nth=0').fill('');
                page.locator('input[aria-label="order-tariff-amount"] >> nth=0').type(tariffAmount);
                page.waitForTimeout(1000);

                return Promise.all([
                    page.locator('button[name="save-order-tariff-amount"] >> nth=0').click(),
                ]);
            });
        })
        .then(() => {
            group('WarehouseDasboardTabs2: Check Tariff Amount value and click Charge Tariff button', function () {
                page.waitForSelector('div[aria-label="tariff-management"]');
                page.waitForSelector('button[name="charge-order-tariff"] >> nth=0');
                page.waitForTimeout(3000);

                check(page, {
                    'WarehouseDasboardTabs[38/42]: Tariff managment: Input (Tariff Amount) typed value saved after clicking save tariff button': page.locator('input[aria-label="order-tariff-amount"] >> nth=0').inputValue() == tariffAmount,
                    'WarehouseDasboardTabs[39/42]: Tariff managment: Button (Charge All) is still disabled': page.locator('button[name="charge-all"]').isDisabled(),
                    'WarehouseDasboardTabs[40/42]: Tariff managment: Button (Charge Tariff) is enabled after clicking save tariff button': page.locator('button[name="charge-order-tariff"] >> nth=0').isEnabled(),
                });

                return Promise.all([
                    page.locator('button[name="charge-order-tariff"] >> nth=0').click(),
                ]);
            });
        })
        .then(() => {
            group('WarehouseDasboardTabs2: Confirm charge tariff amount', function () {
                page.waitForSelector('div[aria-label="charge-tariff-amount-modal"]');

                check(page, {
                    'WarehouseDasboardTabs[41/42]: Tariff managment: Modal (Charge Tariff Amount) - Modal is visible and content matched': page.locator('div[aria-label="charge-tariff-amount-modal"]').isVisible() && page.locator('div.modal-title').textContent() == chargeTariffAmountModalTitle,
                    'WarehouseDasboardTabs[42/42]: Tariff managment: Modal (Charge Tariff Amount) - Button (Confirm) is visible and enabled': page.locator('button[name="charge-tariff-for-order"]').isVisible() && page.locator('button[name="charge-tariff-for-order"]').isEnabled(),
                });

                return Promise.all([
                    page.locator('button[name="charge-tariff-for-order"]').click(),
                ]);
            });
        })
        .then(() => {
            group('WarehouseDasboardTabs2: Wait Tariff Managment tab', function () {
                page.waitForSelector('div[aria-label="tariff-management"]');
            });
        })
        .finally(() => {
            page.close();
            browser.close();
        });
}