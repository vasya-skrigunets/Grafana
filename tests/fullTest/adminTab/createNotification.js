import { check, group } from 'k6';
import { chromium } from 'k6/x/browser';

export function CreateNotification() {
    const adminUrl = 'https://dev.dev.skudrop.com/login';

    const email = 'admin@example.com';
    const password = 'admin';

    const userCommunicationPageTitle = "SKUdrop customer communication";
    const selectBannerPeriodModalTitle = "SELECT BANNER PERIOD";

    const startTime = "0001AM";
    const endTime = "2359PM";

    const bannerText = "K6 Test Banner";
    const notificationText = "K6 Test Notification";

    const browser = chromium.launch({
        headless: true,
    });

    const context = browser.newContext({
        ignoreHTTPSErrors: true,
    });

    context.setDefaultTimeout(60000);
    context.setDefaultNavigationTimeout(60000);

    const page = context.newPage();

    page.goto(adminUrl, { waitUntil: 'networkidle' })
        .then(() => {
            group('CreateNotification: Visit login page and authorization', function () {
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
            group('CreateNotification: Wait for Warehouse Dashboard page and go to User Communication page', function () {
                page.waitForSelector('div[aria-label="total-units-stored"] > h1 >> nth=0');

                return Promise.all([
                    page.waitForNavigation(),
                    page.locator('a[href="/dashboard-warehouse/user-communication/"]').click(),
                ]);
            });
        })
        .then(() => {
            group('CreateNotification: Check User Communication page, fill in banner and notification text and click Select Tenant dropdown', function () {
                page.waitForSelector('div[aria-label="user-communication-container"]');

                check(page, {
                    'CreateNotification[1/8]: User Communication: Page is visible and content match after redirection to page': page.locator('div[aria-label="user-communication-container"]').isVisible() && page.locator('span[aria-label="user-communication-label"]').textContent() == userCommunicationPageTitle,
                    'CreateNotification[2/8]: User Communication: Input (Banner) is visible and editable': page.locator('input[name="banner"]').isVisible() && page.locator('input[name="banner"]').isEditable(),
                    'CreateNotification[3/8]: User Communication: Input (Notification) is visible and editable': page.locator('input[name="notification"]').isVisible() && page.locator('input[name="notification"]').isEditable(),
                    'CreateNotification[4/8]: User Communication: Input (Email) is visible and editable': page.locator('textarea[name="email"]').isVisible() && page.locator('textarea[name="email"]').isEditable(),
                    'CreateNotification[5/8]: User Communication: Buttons (Select period and Send) is visible and enabled': page.locator('button[name="send-notification"]').isVisible() && page.locator('button[name="send-notification"]').isEnabled() && page.locator('button[name="select-banner-period"]').isVisible() && page.locator('button[name="select-banner-period"]').isEnabled(),
                });

                page.locator('input[name="banner"]').fill(bannerText);
                page.locator('input[name="notification"]').fill(notificationText);

                return Promise.all([
                    page.locator('div[aria-hidden="true"]').click(),
                ]);
            });
        })
        .then(() => {
            group('CreateNotification: Select tenant (voicebyte@me.com) and click Select Period button', function () {
                page.waitForSelector('div[id="react-select-5-listbox"]');
                page.locator('div[id="react-select-5-listbox"] >> nth=0').click();
                page.waitForTimeout(1000);
                page.locator('div[aria-hidden="true"] >> nth=-1').click();
                page.waitForTimeout(1000);

                return Promise.all([
                    page.locator('button[name="select-banner-period"]').click(),
                ]);
            });
        })
        .then(() => {
            group('CreateNotification: Check Select Banner Period modal, filling data and click Save Period button', function () {
                page.waitForSelector('div[aria-label="select-banner-period-modal"]');

                check(page, {
                    'CreateNotification[6/8]: User Communication: Modal (Select Banner Period) is visible and content match after clicking Select Period button': page.locator('div[aria-label="select-banner-period-modal"]').isVisible() && page.locator('h6[aria-label="select-banner-period-modal-title"]').textContent() == selectBannerPeriodModalTitle,
                    'CreateNotification[7/8]: User Communication: Modal (Select Banner Period) Input (Date and Time) is visible and editable': page.locator('input[placeholder="Early"]').isVisible() && page.locator('input[placeholder="Early"]').isEditable() && page.locator('input[name="start-time"]').isVisible() && page.locator('input[name="start-time"]').isEditable(),
                    'CreateNotification[8/8]: User Communication: Modal (Select Banner Period) Buttons (Save Period) is visible and enabled': page.locator('button[name="save-period"]').isVisible() && page.locator('button[name="save-period"]').isEnabled(),
                });

                page.locator('button.rdrDayStartOfMonth').click();
                page.waitForTimeout(500);
                page.locator('button.rdrDayEndOfMonth').click();
                page.waitForTimeout(500);

                page.locator('input[name="start-time"]').type(startTime, {delay: 25});
                page.waitForTimeout(500);
                page.locator('input[name="end-time"]').type(endTime, {delay: 25});
                page.waitForTimeout(500);

                return Promise.all([
                    page.locator('button[name="save-period"]').click(),
                ]);
            });
        })
        .then(() => {
            group('CreateNotification: Wait for User Communication page and click Send button', function () {
                page.waitForSelector('div[aria-label="user-communication-container"]');

                return Promise.all([
                    page.locator('button[name="send-notification"]').click(),
                ]);
            });
        })
        .then(() => {
            group('CreateNotification: Wait for User Comminucation Page', function () {
                page.waitForSelector('div[aria-label="user-communication-container"]');
            });
        })
        .finally(() => {
            page.close();
            browser.close();
        });
}