import { check, group } from 'k6';
import { chromium } from 'k6/x/browser';

export function IncomingCartons() {
    const url = 'https://dev.dev.skudrop.com/login';

    const email = 'admin@example.com';
    const password = 'admin';

    let totalUnitsStoredBefore, totalUnitsStoredAfter = 0;
    let totalCartonsStoredBefore, totalCartonsStoredAfter = 0;
    let cubicMetersStoredBefore, cubicMetersStoredAfter = 0;
    let cubicMetersIncomingBefore, cubicMetersIncomingAfter = 0;
    let cartonsIncomingBefore, cartonsIncomingAfter = 0;
    let cartonsInOrderBefore, cartonsInOrderAfter = 0;

    let contactNameBefore, contactNameAfter = '';
    const numberOfCartons = "1";

    const loginPageText = "Log In to SKUdrop";
    const confirmCartonsReceivedModalTitle = "Confirm cartons received";
    const incomingCartonsTabTableTitle = "Incoming cartons";
    const fileDownloadsModalTitle = "FILE DOWNLOADS";


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
            group('IncomingCartons: Visit and check login page, authorization', function () {
                page.waitForSelector('h4[aria-label="login-page-title"]');

                check(page, {
                    'IncomingCartons[1/30]: Login Page: Content is matching': page.locator('img[alt="logo"]').isVisible() && page.locator('h4[aria-label="login-page-title"]').textContent() == loginPageText,
                    'IncomingCartons[2/30]: Login Page: Form is editable': page.locator('input[name="email"]').isEditable() && page.locator('input[name="password"]').isEditable(),
                });

                page.locator('input[name="email"]').fill(email);
                page.locator('input[name="password"]').fill(password);

                check(page, {
                    'IncomingCartons[3/30]: Login Page: Button is visible and enabled': page.locator('button[name="login-page_login-button"]').isVisible() && page.locator('button[name="login-page_login-button"]').isEnabled(),
                });

                return Promise.all([
                    page.waitForNavigation(),
                    page.locator('button[name="login-page_login-button"]').click(),
                ]);
            });
        })
        .then(() => {
            group('IncomingCartons: Check Incoming Cartons, record delivery statistics and click Received button', function () {
                page.waitForSelector('div[aria-label="total-units-stored"] > h1 >> nth=0');

                check(page, {
                    'IncomingCartons[4/30]: Warehouse Dasboard: Content is matching': page.locator('h5[aria-label="incoming-cartons-table-title"]').textContent() == incomingCartonsTabTableTitle,
                });
                page.waitForTimeout(5000);

                totalUnitsStoredBefore = parseFloat(page.locator('div[aria-label="total-units-stored"] > h1 >> nth=0').textContent());
                totalCartonsStoredBefore = parseFloat(page.locator('div[aria-label="total-cartons-stored"] > h1 >> nth=0').textContent());
                cubicMetersStoredBefore = parseFloat(page.locator('div[aria-label="cubic-meters-stored"] > h1 >> nth=0').textContent());
                cubicMetersIncomingBefore = parseFloat(page.locator('div[aria-label="cubic-meters-stored"] > span >> nth=0').textContent());
                cartonsIncomingBefore = parseFloat(page.locator('div[aria-label="cartons-incoming"] > div > h5 >> nth=0').textContent());
                cartonsInOrderBefore = parseFloat(page.locator('b[aria-label="number-of-cartons"] >> nth=0').textContent());

                check(page, {
                    'IncomingCartons[5/30]: Warehouse Dasboard: Incoming cartons - Button (Received) is visible and enabled': page.locator('button[name="received-order"] >> nth=0').isVisible() && page.locator('button[name="received-order"] >> nth=0').isEnabled(),
                    'IncomingCartons[6/30]: Warehouse Dasboard: Incoming cartons - Button (Download) is visible and enabled': page.locator('button[name="download-files"] >> nth=0').isVisible() && page.locator('button[name="download-files"] >> nth=0').isEnabled(),
                });

                return Promise.all([
                    page.locator('button[name="received-order"] >> nth=0').click(),
                ]);
            });
        })
        .then(() => {
            group('IncomingCartons: Check Confirm Cartons Received modal and click Partial Delivery button', function () {
                page.waitForSelector('div[aria-label="confirm-cartons-received"]');

                check(page, {
                    'IncomingCartons[7/30]: Warehouse Dasboard: Incoming cartons - Modal (Confirm Cartons Received) is visible and content matched': page.locator('div[aria-label="confirm-cartons-received"]').isVisible() && page.locator('div.modal-title').textContent() == confirmCartonsReceivedModalTitle,
                    'IncomingCartons[8/30]: Warehouse Dasboard: Incoming cartons - Modal (Confirm Cartons Received) Button (Partial delivery) is visible and enabled': page.locator('button[name="parial-delivery"]').isVisible() && page.locator('button[name="parial-delivery"]').isEnabled(),
                    'IncomingCartons[9/30]: Warehouse Dasboard: Incoming cartons - Modal (Confirm Cartons Received) Button (Upload images) is visible and enabled': page.locator('button[name="upload-images"]').isVisible() && page.locator('button[name="upload-images"]').isEnabled(),
                    'IncomingCartons[10/30]: Warehouse Dasboard: Incoming cartons - Modal (Confirm Cartons Received) Button (Delete) is visible and enabled': page.locator('button[name="delete-received-cartons"]').isVisible() && page.locator('button[name="delete-received-cartons"]').isEnabled(),
                    'IncomingCartons[11/30]: Warehouse Dasboard: Incoming cartons - Modal (Confirm Cartons Received) Button (Received) is visible and enabled': page.locator('button[name="confirm-received-cartons"]').isVisible() && page.locator('button[name="confirm-received-cartons"]').isEnabled(),
                    'IncomingCartons[12/30]: Warehouse Dasboard: Incoming cartons - Modal (Confirm Cartons Received) Number of cartons is editable': page.locator('input[about="number-of-cartons"]').isEditable(),
                });

                return Promise.all([
                    page.locator('button[name="parial-delivery"]').click(),
                ]);
            });
        })
        .then(() => {
            group('IncomingCartons: Fill in number of cartons and click Received button', function () {
                page.waitForSelector('input[about="received-cartons"]');

                check(page, {
                    'IncomingCartons[13/30]: Warehouse Dasboard: Incoming cartons - Modal (Confirm Cartons Received) Received input is visible and editable': page.locator('input[about="received-cartons"]').isVisible() && page.locator('input[about="received-cartons"]').isEditable(),
                });

                page.locator('input[about="received-cartons"]').fill('');
                page.locator('input[about="received-cartons"]').type(numberOfCartons);

                return Promise.all([
                    page.locator('button[name="confirm-received-cartons"]').click(),
                ]);
            });
        })
        .then(() => {
            group('IncomingCartons: Check delivery statistics change and click Download button', function () {
                page.waitForSelector('div[aria-label="total-units-stored"] > h1 >> nth=0');
                page.waitForTimeout(5000);

                totalUnitsStoredAfter = parseFloat(page.locator('div[aria-label="total-units-stored"] > h1 >> nth=0').textContent());
                totalCartonsStoredAfter = parseFloat(page.locator('div[aria-label="total-cartons-stored"] > h1 >> nth=0').textContent());
                cubicMetersStoredAfter = parseFloat(page.locator('div[aria-label="cubic-meters-stored"] > h1 >> nth=0').textContent());
                cubicMetersIncomingAfter = parseFloat(page.locator('div[aria-label="cubic-meters-stored"] > span >> nth=0').textContent());
                cartonsIncomingAfter = parseFloat(page.locator('div[aria-label="cartons-incoming"] > div > h5 >> nth=0').textContent());
                cartonsInOrderAfter = parseFloat(page.locator('b[aria-label="number-of-cartons"] >> nth=0').textContent());

                check(page, {
                    'IncomingCartons[14/30]: Warehouse Dasboard: Total units stored value is changed after receiving cartons': totalUnitsStoredBefore < totalUnitsStoredAfter,
                    'IncomingCartons[15/30]: Warehouse Dasboard: Total cartons stored is changed after receiving cartons': totalCartonsStoredBefore < totalCartonsStoredAfter,
                    'IncomingCartons[16/30]: Warehouse Dasboard: Cubic meters stored is changed after receiving cartons': cubicMetersStoredBefore < cubicMetersStoredAfter,
                    'IncomingCartons[17/30]: Warehouse Dasboard: Cubic meters incoming is changed after receiving cartons': cubicMetersIncomingBefore > cubicMetersIncomingAfter,
                    'IncomingCartons[18/30]: Warehouse Dasboard: Cartons incoming is changed after receiving cartons': cartonsIncomingBefore > cartonsIncomingAfter,
                    'IncomingCartons[19/30]: Warehouse Dasboard: Cartons in order is changed after receiving cartons': cartonsInOrderBefore > cartonsInOrderAfter,
                });

                return Promise.all([
                    page.locator('button[name="download-files"] >> nth=0').click(),
                ]);
            });
        })
        .then(() => {
            group('IncomingCartons: Check File Downloads modal, fill in another Contact Name and click Save button', function () {
                page.waitForSelector('div[aria-label="incoming-cartons_file-download-modal"]');

                check(page, {
                    'IncomingCartons[20/30]: Warehouse Dasboard: Incoming cartons - Modal (File downloads) is visible and content matched after clicking download button': page.locator('div[aria-label="incoming-cartons_file-download-modal"]').isVisible() && page.locator('div.modal-title').textContent() == fileDownloadsModalTitle,
                    'IncomingCartons[21/30]: Warehouse Dasboard: Incoming cartons - Modal (File downloads) Button (Download product detail information) is visible, enabled, href has a link': page.locator('a[name="download-product-detail-information"]').isVisible() && page.locator('a[name="download-product-detail-information"]').isEnabled() && page.locator('a[name="download-product-detail-information"]').getAttribute('href') != '',
                    'IncomingCartons[22/30]: Warehouse Dasboard: Incoming cartons - Modal (File downloads) Button (Download warehouse receiving information) is visible and enabled': page.locator('a[name="download-warehouse-receiving-information"]').isVisible() && page.locator('a[name="download-warehouse-receiving-information"]').isEnabled() && page.locator('a[name="download-warehouse-receiving-information"]').getAttribute('href') != '',
                    'IncomingCartons[23/30]: Warehouse Dasboard: Incoming cartons - Modal (File downloads) Button (Download commercial invoice) is visible and enabled': page.locator('a[name="download-comercial-invoice"]').isVisible() && page.locator('a[name="download-comercial-invoice"]').isEnabled() && page.locator('a[name="download-comercial-invoice"]').getAttribute('href') != '',
                    'IncomingCartons[24/30]: Warehouse Dasboard: Incoming cartons - Modal (File downloads) Button (Download all) is visible and enabled': page.locator('button[name="download-all"]').isVisible() && page.locator('button[name="download-all"]').isEnabled(),
                    'IncomingCartons[25/30]: Warehouse Dasboard: Incoming cartons - Modal (File downloads) Button (Save) is visible and enabled': page.locator('button[name="save"]').isVisible() && page.locator('button[name="save"]').isEnabled(),
                    'IncomingCartons[26/30]: Warehouse Dasboard: Incoming cartons - Modal (File downloads) Contact name is editable': page.locator('input[name="contact_name"]').isEditable(),
                    'IncomingCartons[27/30]: Warehouse Dasboard: Incoming cartons - Modal (File downloads) Contact phone is editable': page.locator('input[name="contact_phone"]').isEditable(),
                    'IncomingCartons[28/30]: Warehouse Dasboard: Incoming cartons - Modal (File downloads) Est. delivery is editable': page.locator('input[name="time"]').isEditable(),
                    'IncomingCartons[29/30]: Warehouse Dasboard: Incoming cartons - Modal (File downloads) Notes is editable': page.locator('textarea[name="notes"]').isEditable(),
                });

                contactNameBefore = page.locator('input[name="contact_name"]').inputValue();
                page.locator('input[name="contact_name"]').fill(contactNameBefore + 'K6');

                return Promise.all([
                    page.locator('button[name="save"]').click(),
                ]);
            });
        })
        .then(() => {
            group('IncomingCartons: Click Download button', function () {
                page.waitForSelector('div[aria-label="total-units-stored"] > h1 >> nth=0');
                page.waitForTimeout(2000);

                return Promise.all([
                    page.locator('button[name="download-files"] >> nth=0').click(),
                ]);
            });
        })
        .then(() => {
            group('IncomingCartons: Verify Contact Name changing', function () {
                page.waitForSelector('div[aria-label="incoming-cartons_file-download-modal"]');

                contactNameAfter = page.locator('input[name="contact_name"]').inputValue();

                check(page, {
                    'IncomingCartons[30/30]: Warehouse Dasboard: Incoming cartons - Modal (File downloads) Contact name saved after changing data': contactNameAfter == contactNameBefore + 'K6',
                });
            });
        })
        .finally(() => {
            page.close();
            browser.close();
        });
}