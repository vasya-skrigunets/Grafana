import { check, group } from 'k6';
import { chromium } from 'k6/x/browser';

export function WarehouseDasboardTabs() {
    const url = 'https://dev.dev.skudrop.com/login';

    const email = 'admin@example.com';
    const password = 'admin';

    let totalUnitsStoredBefore, totalUnitsStoredAfter = 0;
    let totalCartonsStoredBefore, totalCartonsStoredAfter = 0;
    let cubicMetersStoredBefore, cubicMetersStoredAfter = 0;
    let cartonsInPrepBefore, cartonsInPrepAfter = 0;
    let cubicMetersAvailableBefore, cubicMetersAvailableAfter = 0;

    const generatedTrackingId = '1Z76629R435' + Math.floor(Math.random() * 10000000);

    const ordersToPrepTableTitle = "Orders to prep";
    const fileDownloadsModalTitle = "FILE DOWNLOADS";
    const confirmationReqiredModalTitle = "CONFIRMATION REQUIRED";
    const orderToShipTableTitle = "Orders to ship";
    const confirmFinalWeightModalTitle = "Confirm final weight";
    const trackingIdEntryTableTitle = " Tracking ID entry";
    const confirmTrackingIdModalTitle = "CONFIRM TRACKING ID";

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
            group('WarehouseDasboardTabs: Visit login page and authorization', function () {
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
            group('WarehouseDasboardTabs: Waiting for Warehouse Dashboard page, record delivery statistics and redirecting to Orders To Prep tab', function () {
                page.waitForSelector('div[aria-label="total-units-stored"] > h1 >> nth=0');

                totalUnitsStoredBefore = parseFloat(page.locator('div[aria-label="total-units-stored"] > h1 >> nth=0').textContent());
                totalCartonsStoredBefore = parseFloat(page.locator('div[aria-label="total-cartons-stored"] > h1 >> nth=0').textContent());
                cubicMetersStoredBefore = parseFloat(page.locator('div[aria-label="cubic-meters-stored"] > h1 >> nth=0').textContent());
                cartonsInPrepBefore = parseFloat(page.locator('div[aria-label="outgoing-prepared-cartons"] > h1 >> nth=0').textContent());
                cubicMetersAvailableBefore = parseFloat(page.locator('div[aria-label="cubic-meters-available"] > div > h5 >> nth=0').textContent());

                return Promise.all([
                    page.waitForNavigation(),
                    page.locator('button[id="Dashboard-tab-OrdersToPrep"]').click(),
                ]);
            });
        })
        .then(() => {
            group('WarehouseDasboardTabs: Check Orders To Prep tab and click Show Downloads button', function () {
                page.waitForSelector('div[aria-label="orders-to-prep-table"]');

                check(page, {
                    'WarehouseDasboardTabs[1/42]: Orders to prep: Window is visible and content match after redirect to tab': page.locator('div[aria-label="orders-to-prep-table"]').isVisible() && page.locator('div[aria-label="orders-to-prep-table"] > h5').textContent() == ordersToPrepTableTitle,
                    'WarehouseDasboardTabs[2/42]: Orders to prep: Buttons (Download and Yes) is visible and enabled': page.locator('button[name="show-downloads"] >> nth=0').isVisible() && page.locator('button[name="show-downloads"] >> nth=0').isEnabled() && page.locator('button[name="complete-order"] >> nth=0').isVisible() && page.locator('button[name="complete-order"] >> nth=0').isEnabled(),
                });

                return Promise.all([
                    page.locator('button[name="show-downloads"] >> nth=0').click(),
                ]);
            });
        })
        .then(() => {
            group('WarehouseDasboardTabs: Check Show Downloads modal and click Close button', function () {
                page.waitForSelector('div[aria-label="orders-to-prep_file-downloads-modal"]');

                check(page, {
                    'WarehouseDasboardTabs[3/42]: Orders to prep: Modal (File Downloads) is visible and content matched': page.locator('div[aria-label="orders-to-prep_file-downloads-modal"]').isVisible() && page.locator('div.modal-title').textContent() == fileDownloadsModalTitle,
                    'WarehouseDasboardTabs[4/42]: Orders to prep: Modal (File Downloads) Button (Download Fba shipping label) is visible and enabled': page.locator('a[name="download-fba-shipping-label"]').isVisible() && page.locator('a[name="download-fba-shipping-label"]').isEnabled() && page.locator('a[name="download-fba-shipping-label"]').getAttribute('href') != '',
                    'WarehouseDasboardTabs[5/42]: Orders to prep: Modal (File Downloads) Button (Download Shipping to FBA template) is visible and enabled': page.locator('a[name="download-shipping-to-fba-template"]').isVisible() && page.locator('a[name="download-shipping-to-fba-template"]').isEnabled() && page.locator('a[name="download-shipping-to-fba-template"]').getAttribute('href') != '',
                    'WarehouseDasboardTabs[6/42]: Orders to prep: Modal (File Downloads) Button (Download Shipping labels) is visible and enabled': page.locator('a[name="download-shipping-labels"]').isVisible() && page.locator('a[name="download-shipping-labels"]').isEnabled() && page.locator('a[name="download-shipping-labels"]').getAttribute('href') != '',
                    'WarehouseDasboardTabs[7/42]: Orders to prep: Modal (File Downloads) Button (Download All) is visible and enabled': page.locator('button[name="download-all"]').isVisible() && page.locator('button[name="download-all"]').isEnabled(),
                });

                return Promise.all([
                    page.locator('button[class="btn-close"]').click(),
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

                check(page, {
                    'WarehouseDasboardTabs[8/42]: Orders to prep: Modal (Confirmation Required) is visible and content matched': page.locator('div[aria-label="order-to-prep_confirmation-required-modal"]').isVisible() && page.locator('div.modal-title').textContent() == confirmationReqiredModalTitle,
                    'WarehouseDasboardTabs[9/42]: Orders to prep: Modal (Confirmation Required) Buttons (No and Yes) is visible and enabled': page.locator('button[name="confirm-require"]').isVisible() && page.locator('button[name="confirm-require"]').isEnabled() && page.locator('button[name="cancel-require"]').isVisible() && page.locator('button[name="cancel-require"]').isEnabled(),
                });

                return Promise.all([
                    page.locator('button[name="confirm-require"]').click(),
                ]);
            });
        })
        .then(() => {
            group('WarehouseDasboardTabs: Go to Orders To Ship tab', function () {
                page.waitForSelector('div[aria-label="orders-to-prep"]');
                page.waitForTimeout(1000);

                return Promise.all([
                    page.waitForNavigation(),
                    page.locator('button[id="Dashboard-tab-OrderToShip"]').click(),
                ]);
            });
        })
        .then(() => {
            group('WarehouseDasboardTabs: Check Orders To Ship tab and click Picked Up button', function () {
                page.waitForSelector('div[aria-label="orders-to-ship"]');

                check(page, {
                    'WarehouseDasboardTabs[10/42]: Orders to ship: Window is visible and content match after redirect to tab': page.locator('div[aria-label="orders-to-ship-table"]').isVisible() && page.locator('div[aria-label="orders-to-ship-table"] > h5').textContent() == orderToShipTableTitle,
                    'WarehouseDasboardTabs[11/42]: Orders to ship: Button Yes (Picked Up) is visible and enabled': page.locator('button[name="confirm-pick-up"] >> nth=0').isVisible() && page.locator('button[name="confirm-pick-up"] >> nth=0').isEnabled(),
                    'WarehouseDasboardTabs[12/42]: Orders to ship: Button Yes (Shipped) is visible and disabled': page.locator('button[name="confirm-loading"] >> nth=0').isVisible() && page.locator('button[name="confirm-loading"] >> nth=0').isDisabled(),
                });

                return Promise.all([
                    page.locator('button[name="confirm-pick-up"] >> nth=0').click(),
                ]);
            });
        })
        .then(() => {
            group('WarehouseDasboardTabs: Check picked up status and click Loaded button', function () {
                page.waitForSelector('div[aria-label="orders-to-ship-table"]');

                check(page, {
                    'WarehouseDasboardTabs[13/42]: Orders to ship: Picked up status is true after clicking Picked Up button': page.locator('svg[name="picked-up"]').isVisible(),
                    'WarehouseDasboardTabs[14/42]: Orders to ship: Button Yes (Shipped) is enabled after confirming the picked up status': page.locator('button[name="confirm-loading"] >> nth=0').isEnabled(),
                });

                return Promise.all([
                    page.locator('button[name="confirm-loading"] >> nth=0').click(),
                ]);
            });
        })
        .then(() => {
            group('WarehouseDasboardTabs: Check Confirm Final Weight modal and click Yes button', function () {
                page.waitForSelector('div[aria-label="confirm-final-weight-modal"]');

                check(page, {
                    'WarehouseDasboardTabs[15/42]: Orders to ship: Modal (Confirm final weight) - Modal is visible and content matched': page.locator('div[aria-label="confirm-final-weight-modal"]').isVisible() && page.locator('div.modal-title').textContent() == confirmFinalWeightModalTitle,
                    'WarehouseDasboardTabs[16/42]: Orders to ship: Modal (Confirm final weight) - Final weight input is visible and editable': page.locator('input[name="FinalWeight"]').isVisible() && page.locator('input[name="FinalWeight"]').isEditable(),
                    'WarehouseDasboardTabs[17/42]: Orders to ship: Modal (Confirm final weight) - Button (Yes) is visible and enabled': page.locator('button[name="confirm-final-weight"]').isVisible() && page.locator('button[name="confirm-final-weight"]').isEnabled(),
                });

                return Promise.all([
                    page.locator('button[name="confirm-final-weight"]').click(),
                ]);
            });
        })
        .then(() => {
            group('WarehouseDasboardTabs: Go to Tracking ID Entry tab', function () {
                page.waitForSelector('div[aria-label="orders-to-ship"]');

                return Promise.all([
                    page.waitForNavigation(),
                    page.locator('button[id="Dashboard-tab-TrackingIDEntry"]').click(),
                ]);
            });
        })
        .then(() => {
            group('WarehouseDasboardTabs: Check Tracking ID Entry tab, check changing recorded delivery statistics and click Choose Date button', function () {
                page.waitForSelector('div[aria-label="tracking-id-entry"]');

                totalUnitsStoredAfter = parseFloat(page.locator('div[aria-label="total-units-stored"] > h1 >> nth=0').textContent());
                totalCartonsStoredAfter = parseFloat(page.locator('div[aria-label="total-cartons-stored"] > h1 >> nth=0').textContent());
                cubicMetersStoredAfter = parseFloat(page.locator('div[aria-label="cubic-meters-stored"] > h1 >> nth=0').textContent());
                cartonsInPrepAfter = parseFloat(page.locator('div[aria-label="outgoing-prepared-cartons"] > h1 >> nth=0').textContent());
                cubicMetersAvailableAfter = parseFloat(page.locator('div[aria-label="cubic-meters-available"] > div > h5 >> nth=0').textContent());

                check(page, {
                    'WarehouseDasboardTabs[18/42]: Total units stored value is changed after ship confirmation': totalUnitsStoredBefore > totalUnitsStoredAfter,
                    'WarehouseDasboardTabs[19/42]: Total cartons stored value is changed after ship confirmation': totalCartonsStoredBefore > totalCartonsStoredAfter,
                    'WarehouseDasboardTabs[20/42]: Cubic meters stored value is changed after ship confirmation': cubicMetersStoredBefore > cubicMetersStoredAfter,
                    'WarehouseDasboardTabs[21/42]: Cartons in prep value is changed after ship confirmation': cartonsInPrepBefore > cartonsInPrepAfter,
                    'WarehouseDasboardTabs[22/42]: Cubic meters available value is changed after ship confirmation': cubicMetersAvailableBefore < cubicMetersAvailableAfter,
                });

                check(page, {
                    'WarehouseDasboardTabs[23/42]: Tracking ID entry: Window is visible and content match': page.locator('div[aria-label="tracking-id-entry-table"]').isVisible() && page.locator('div[aria-label="tracking-id-entry-table"] > h5').textContent() == trackingIdEntryTableTitle,
                    'WarehouseDasboardTabs[24/42]: Tracking ID entry: Button (Choose Date) is visible and enabled': page.locator('button[name="choose-date"] >> nth=0').isVisible() && page.locator('button[name="choose-date"] >> nth=0').isEnabled(),
                    'WarehouseDasboardTabs[25/42]: Tracking ID entry: Button (Add) is visible and enabled': page.locator('button[name="add-tracking-id"] >> nth=0').isVisible() && page.locator('button[name="add-tracking-id"] >> nth=0').isEnabled(),
                });

                return Promise.all([
                    page.locator('button[name="choose-date"] >> nth=0').click(),
                ]);
            });
        })
        .then(() => {
            group('WarehouseDasboardTabs: Check Date Picker and choose date (last day of month)', function () {
                page.waitForSelector('div[id="popover-basic"]');

                check(page, {
                    'WarehouseDasboardTabs[26/42]: Tracking ID entry: Date picker is visible': page.locator('div[id="popover-basic"]').isVisible(),
                    'WarehouseDasboardTabs[27/42]: Tracking ID entry: Date picker Last day of the month button is visible and enabled': page.locator('button.rdrDayEndOfMonth').isVisible() && page.locator('button.rdrDayEndOfMonth').isEnabled(),
                });

                return Promise.all([
                    page.locator('button.rdrDayEndOfMonth').click(),
                ]);
            });
        })
        .then(() => {
            group('WarehouseDasboardTabs: Wait for tracking ID Entry tab and click Add tracking ID button', function () {
                page.waitForSelector('div[aria-label="tracking-id-entry"]');
                page.waitForTimeout(1000);

                return Promise.all([
                    page.locator('button[name="add-tracking-id"] >> nth=0').click(),
                ]);
            });
        })
        .then(() => {
            group('WarehouseDasboardTabs: Check Confirm Tracking ID modal, fill in Tracking ID and click Confirm button', function () {
                page.waitForSelector('div[aria-label="confirm-tracking-id-modal"]');

                check(page, {
                    'WarehouseDasboardTabs[28/42]: Tracking ID entry: Modal (Confirm Tracking ID) is visible and content matched': page.locator('div[aria-label="confirm-tracking-id-modal"]').isVisible() && page.locator('div.modal-title').textContent() == confirmTrackingIdModalTitle,
                    'WarehouseDasboardTabs[29/42]: Tracking ID entry: Modal (Confirm Tracking ID) Tracking id input is visible and editable': page.locator('input[name="trackingId0"]').isVisible() && page.locator('input[name="trackingId0"]').isEditable(),
                    'WarehouseDasboardTabs[30/42]: Tracking ID entry: Modal (Confirm Tracking ID) Button (Confirm) is visible and enabled': page.locator('button[name="confirm-tracking-id"]').isVisible() && page.locator('button[name="confirm-tracking-id"]').isEnabled(),
                });
                page.waitForTimeout(500);
                page.locator('input[name="trackingId0"]').fill(generatedTrackingId);
                page.waitForTimeout(500);
                
                return Promise.all([
                    page.locator('button[name="confirm-tracking-id"]').click(),
                ]);
            });
        })
        .then(() => {
            group('WarehouseDasboardTabs: Check added tracking id', function () {
                page.waitForSelector('div[aria-label="tracking-id-entry-table"]');
                page.waitForTimeout(1000);

                check(page, {
                    'WarehouseDasboardTabs[31/42]: Tracking ID entry: Order Tracking ID was successfully added': page.locator('div[aria-label="tracking-id"] >> nth=-1').textContent() == generatedTrackingId,
                });
            });
        })
        .finally(() => {
            page.close();
            browser.close();
        });
}