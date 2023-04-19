import { check, group } from 'k6';
import { chromium } from 'k6/x/browser';

export function TaxRule() {
    const url = 'https://test123.portal.dev.skudrop.com/login';

    const email = 'admin@example.com';
    const password = 'admin';

    const pol = "K6Pol";
    const customerName = "Test"

    const firstTariff = "1.00000";
    const firstAdditionalTariff = "1.10000";
    const firstMerchandiceProcessingFee = "1.20000";
    const firstHarbourMaintenance = "1.30000";
    const secondTariff = "2.00000";
    const secondAdditionalTariff = "2.10000";
    const secondMerchandiceProcessingFee = "2.20000";
    const secondHarbourMaintenance = "2.30000";

    const customerDetailsModalDetailTitle = "Destination";

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
            group('TaxRule: Visit login page and authorization', function () {
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
            group('TaxRule: Waiting for Shipping Dashboard page and click CLX+ button', function () {
                page.waitForSelector('tbody[aria-label="add-container-table-body"]');

                check(page, {
                    'TaxRule[1/18]: Shipping Dashboard: Packing List: Container is visible on REGULAR tab': page.locator('tbody[aria-label="add-container-table-body"]').isVisible() && page.locator('td[about="pol"]').textContent() == pol,
                });

                return Promise.all([
                    page.locator('a[data-rr-ui-event-key="CLXPLUS"] >> nth=0').click(),
                ]);
            });
        })
        .then(() => {
            group('TaxRule: Check the absence of the container and the products in CLX+ tab and click CLX Express button', function () {
                page.waitForSelector('div[aria-label="no-containers-notification"]');

                check(page, {
                    'TaxRule[2/18]: Shipping Dashboard: Packing List: There is no container in CLX+ tab': page.locator('div[aria-label="no-containers-notification"]').isVisible(),
                    'TaxRule[3/18]: Shipping Dashboard: Packing List: There are no products in CLX+ tab': page.locator('div[aria-label="no-products-notification"]').isVisible(),
                });

                return Promise.all([
                    page.locator('a[data-rr-ui-event-key="CLXEXPRESS"] >> nth=0').click(),
                ]);
            });
        })
        .then(() => {
            group('TaxRule: Check the absence of the container and products in CLX Express tab and go to Tax Rule page', function () {
                page.waitForSelector('div[aria-label="no-containers-notification"]');

                check(page, {
                    'TaxRule[4/18]: Shipping Dashboard: Packing List: There is no container in CLX Express tab': page.locator('div[aria-label="no-containers-notification"]').isVisible(),
                    'TaxRule[5/18]: Shipping Dashboard: Packing List: There are no products in CLX Express tab': page.locator('div[aria-label="no-products-notification"]').isVisible(),
                });

                return Promise.all([
                    page.waitForNavigation(),
                    page.locator('button[id="Dashboard-tab-TaxRule"]').click(),
                ]);
            });
        })
        .then(() => {
            group('TaxRule: Check Tax Rule Page and fill in first HS tax data', function () {
                page.waitForSelector('tbody[about="tax-rule-products-body"]');
                page.waitForTimeout(1000);

                check(page, {
                    'TaxRule[6/18]: Shipping Dashboard: Tax Rule: Input (Tariff) is editable': page.locator('input[about="tariff"] >> nth=0').isEditable(),
                    'TaxRule[7/18]: Shipping Dashboard: Tax Rule: Input (Additional Tariff) is editable': page.locator('input[about="additional-tariff"] >> nth=0').isEditable(),
                    'TaxRule[8/18]: Shipping Dashboard: Tax Rule: Input (Merchandice Processing Fee) is editable': page.locator('input[about="merchandise-fee"] >> nth=0').isEditable(),
                    'TaxRule[9/18]: Shipping Dashboard: Tax Rule: Input (Harbour Maintenance) is editable': page.locator('input[about="harbour-maintenance"] >> nth=0').isEditable(),
                    'TaxRule[10/18]: Shipping Dashboard: Tax Rule: Button (Save) is visible and enabled': page.locator('button[name="save-tax"] >> nth=0').isVisible() && page.locator('button[name="save-tax"] >> nth=0').isEnabled(),
                });

                page.locator('input[about="tariff"] >> nth=0').fill('');
                page.locator('input[about="tariff"] >> nth=0').fill(firstTariff);
                page.locator('input[about="additional-tariff"] >> nth=0').fill('');
                page.locator('input[about="additional-tariff"] >> nth=0').fill(firstAdditionalTariff);
                page.locator('input[about="merchandise-fee"] >> nth=0').fill('');
                page.locator('input[about="merchandise-fee"] >> nth=0').fill(firstMerchandiceProcessingFee);
                page.locator('input[about="harbour-maintenance"] >> nth=0').fill('');
                page.locator('input[about="harbour-maintenance"] >> nth=0').fill(firstHarbourMaintenance);

                page.waitForTimeout(500);

                return Promise.all([
                    page.locator('button[name="save-tax"] >> nth=0').click(),
                ]);
            });
        })
        .then(() => {
            group('TaxRule: Fill in second HS tax data', function () {
                page.waitForSelector('tbody[about="tax-rule-products-body"]');
                page.waitForTimeout(1000);

                page.locator('input[about="tariff"] >> nth=-1').fill('');
                page.locator('input[about="tariff"] >> nth=-1').fill(secondTariff);
                page.locator('input[about="additional-tariff"] >> nth=-1').fill('');
                page.locator('input[about="additional-tariff"] >> nth=-1').fill(secondAdditionalTariff);
                page.locator('input[about="merchandise-fee"] >> nth=-1').fill('');
                page.locator('input[about="merchandise-fee"] >> nth=-1').fill(secondMerchandiceProcessingFee);
                page.locator('input[about="harbour-maintenance"] >> nth=-1').fill('');
                page.locator('input[about="harbour-maintenance"] >> nth=-1').fill(secondHarbourMaintenance);

                page.waitForTimeout(500);

                return Promise.all([
                    page.locator('button[name="save-tax"] >> nth=-1').click(),
                ]);
            });
        })
        .then(() => {
            group('TaxRule: Check tax data and go to Sea Shipping page', function () {
                page.waitForSelector('tbody[about="tax-rule-products-body"]');

                page.waitForTimeout(500);

                check(page, {
                    'TaxRule[11/18]: Shipping Dashboard: Tax Rule: Input (Tariff) has correct data': page.locator('input[about="tariff"] >> nth=0').inputValue() == firstTariff,
                    'TaxRule[12/18]: Shipping Dashboard: Tax Rule: Input (Merchandice Processing Fee) has correct data': page.locator('input[about="merchandise-fee"] >> nth=0').inputValue() == firstMerchandiceProcessingFee,
                });

                return Promise.all([
                    page.waitForNavigation(),
                    page.locator('button[id="Dashboard-tab-Detail"]').click(),
                ]);
            });
        })
        .then(() => {
            group('TaxRule: Check Sea Shipment page and click first Details button', function () {
                page.waitForSelector('div[aria-label="sea-shipment-page"]');

                check(page, {
                    'TaxRule[13/18]: Shipping Dashboard: Sea Shipment: Page is visible': page.locator('div[aria-label="sea-shipment-page"]').isVisible(),
                    'TaxRule[14/18]: Shipping Dashboard: Sea Shipment: Details filds are visible': page.locator('div[aria-label="shipment-details-field"] >> nth=0').isVisible() && page.locator('div[aria-label="shipment-details-field"] >> nth=-1').isVisible(),
                    'TaxRule[15/18]: Shipping Dashboard: Sea Shipment: Customer is valid': page.locator('td[about="customer"] >> nth=0').textContent() == customerName,
                    'TaxRule[16/18]: Shipping Dashboard: Sea Shipment: Button (Details) is visible and enabled': page.locator('button[name="shipment-details"] >> nth=0').isVisible() && page.locator('button[name="shipment-details"] >> nth=0').isEnabled(),
                });

                return Promise.all([
                    page.locator('button[name="shipment-details"] >> nth=0').click(),
                ]);
            });
        })
        .then(() => {
            group('TaxRule: Check Customer Details modal', function () {
                page.waitForSelector('div[aria-label="customer-detail-modal"]');

                check(page, {
                    'TaxRule[17/18]: Shipping Dashboard: Sea Shipment: Modal (Customer Details) - Modal is visible and content match': page.locator('div[aria-label="customer-detail-modal"]').isVisible() && page.locator('div[aria-label="destination-label"]').textContent() == customerDetailsModalDetailTitle,
                    'TaxRule[18/18]: Shipping Dashboard: Sea Shipment: Modal (Customer Details) - Button (Download File) is visible and enabled': page.locator('button[name="download-detail-file"]').isVisible() && page.locator('button[name="download-detail-file"]').isEnabled(),
                });

                return Promise.all([
                    page.locator('button[aria-label="Close"]').click(),
                ]);
            });
        })
        .finally(() => {
            page.close();
            browser.close();
        });
}