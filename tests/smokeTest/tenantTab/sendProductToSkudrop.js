import { check, group } from 'k6';
import { chromium } from 'k6/x/browser';

export function SendProductToSkudrop() {
    const url = 'https://test.dev.skudrop.com/login';

    const email = 'admin@example.com';
    const password = 'admin';

    let cubicMetersIncomingBefore, cubicMetersIncomingAfter = 0;
    const numberOfCartons = "2";

    const totalUnitsStoredText = "Total Units Stored";
    const sendProductToSkudropPageTitle = "Select carton quantities to send to SKUdrop";
    const incomingShipmentDetailsModalTitle = "CONFIRM INCOMING SHIPMENT DETAILS BELOW";
    const waitingForCartonsModalTitle = "THE SKUDROP TEAM ARE NOW WAITING FOR YOUR CARTONS";

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
            group('SendProductToSkudrop: Visit login page and authorization', function () {
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
            group('SendProductToSkudrop: Check Dashboard and redirecting to Send Products to SKUdrop page', function () {
                page.waitForSelector('a[href="/dashboard/send-product"]');

                cubicMetersIncomingBefore = parseFloat(page.locator('div[aria-label="cubic-meters-stored"] > span >> nth=0').textContent());

                check(page, {
                    'SendProductToSkudrop[1/14]: Dasboard: Content is matching': page.locator('div[aria-label="total-units-stored"] > p >> nth=0').isVisible() && page.locator('div[aria-label="total-units-stored"] > p >> nth=0').textContent() == totalUnitsStoredText,
                    'SendProductToSkudrop[2/14]: Dasboard: Send product to amazon hyperlink is visible': page.locator('a[href="/dashboard/send-product-to-amazon"]').isVisible(),
                });

                return Promise.all([
                    page.waitForNavigation(),
                    page.locator('a[href="/dashboard/send-product"]').click(),
                ]);
            });
        })
        .then(() => {
            group('SendProductToSkudrop: Check Send Product To SKUdrop page, fill in Master Cartons value and click Confirm Incoming Shipment button', function () {
                page.waitForSelector('label[aria-label="send-product-to-skudrop-title"]');

                check(page, {
                    'SendProductToSkudrop[3/14]: Send Product To SKUdrop: Content is matching': page.locator('label[aria-label="send-product-to-skudrop-title"]').textContent() == sendProductToSkudropPageTitle,
                    'SendProductToSkudrop[4/14]: Send Product To SKUdrop: Product is editable': page.locator('input[about="product-cartons"] >> nth=0').isEditable() && page.locator('input[about="product-price"] >> nth=0').isEditable() && page.locator('input[about="product-description"] >> nth=0').isEditable(),
                    'SendProductToSkudrop[5/14]: Send Product To SKUdrop: Button (Confirm incoming shipment) is visible and enabled': page.locator('button[name="confirm-incoming-shipment"]').isVisible() && page.locator('button[name="confirm-incoming-shipment"]').isEnabled(),
                });

                page.locator('input[name="Skudrop-003"] >> nth=0').fill('');
                page.locator('input[name="Skudrop-003"] >> nth=0').type(numberOfCartons);    

                return Promise.all([
                    page.locator('button[name="confirm-incoming-shipment"]').click(),
                ]);
            });
        })
        .then(() => {
            group('SendProductToSkudrop: Check Shipment Details modal and click Submit button', function () {
                page.waitForSelector('div[aria-label="confirm-incoming-shipment-details-modal"]');

                check(page, {
                    'SendProductToSkudrop[6/14]: Send Product To SKUdrop: Modal (Incoming shipment details) - Dialog is visible': page.locator('div[aria-label="confirm-incoming-shipment-details-modal"]').isVisible(),
                    'SendProductToSkudrop[7/14]: Send Product To SKUdrop: Modal (Incoming shipment details) - Content is matched': page.locator('div[class="modal-body"] > h5 >> nth=0').textContent() == incomingShipmentDetailsModalTitle,
                    'SendProductToSkudrop[8/14]: Send Product To SKUdrop: Modal (Incoming shipment details) - Est. delivery is editable': page.locator('input[type="date"]').isEditable(),
                    'SendProductToSkudrop[9/14]: Send Product To SKUdrop: Modal (Incoming shipment details) - Checkbox (Must have shipping marks labels) is visible and enabled': page.locator('input[name="check"]').isVisible() && page.locator('input[name="check"]').isEditable(),
                });

                page.locator('input[name="check"]').check();

                check(page, {
                    'SendProductToSkudrop[10/14]: Send Product To SKUdrop: Modal (Incoming shipment details) - Checkbox (Must have shipping marks labels) is checked': page.locator('input[name="check"]').isChecked(),
                });

                return Promise.all([
                    page.locator('button[name="submit-confirmation"]').click(),
                ]);
            });
        })
        .then(() => {
            group('SendProductToSkudrop: Check Waiting For Cartons modal and click Go To Dashboard button', function () {
                page.waitForSelector('div[aria-label="skudrop-waiting-cartons-modal"]');

                check(page, {
                    'SendProductToSkudrop[11/14]: Send Product To SKUdrop: Modal (Waiting For Cartons) - Modal is visible': page.locator('div[aria-label="skudrop-waiting-cartons-modal"]').isVisible(),
                    'SendProductToSkudrop[12/14]: Send Product To SKUdrop: Modal (Waiting For Cartons) - Content is matched': page.locator('h6[aria-label="skudrop-waiting-cartons"]').textContent() == waitingForCartonsModalTitle,
                    'SendProductToSkudrop[13/14]: Send Product To SKUdrop: Modal (Waiting For Cartons) - Button (Go to dashboard) is visible and enabled': page.locator('button[name="go-to-dashboard"]').isVisible() && page.locator('button[name="go-to-dashboard"]').isEnabled(),
                });

                return Promise.all([
                    page.waitForNavigation(),
                    page.locator('button[name="go-to-dashboard"]').click(),
                ]);
            });
        })
        .then(() => {
            group('SendProductToSkudrop: Check the change in the value of incoming cubic meters', function () {
                page.waitForSelector('div[aria-label="cubic-meters-stored"] > span >> nth=0');

                cubicMetersIncomingAfter = parseFloat(page.locator('div[aria-label="cubic-meters-stored"] > span >> nth=0').textContent());

                check(page, {
                    'SendProductToSkudrop[14/14]: Dashboard: Cubic Meters Incoming value is changed': cubicMetersIncomingBefore != cubicMetersIncomingAfter,
                });
            });
        })
        .finally(() => {
            page.close();
            browser.close();
        });
}