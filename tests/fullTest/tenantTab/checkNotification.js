import { check, group } from 'k6';
import { chromium } from 'k6/x/browser';

export function CheckNotification() {
    const tenantUrl = 'https://test.dev.skudrop.com/login';

    const email = 'admin@example.com';
    const password = 'admin';

    const bannerTitle = "✕K6 Test Banner";
    const notificationWindowTitle = "Notifications";
    const notificationTitle = "K6 Test Notification";

    const browser = chromium.launch({
        headless: true,
    });

    const context = browser.newContext({
        ignoreHTTPSErrors: true,
    });

    context.setDefaultTimeout(60000);
    context.setDefaultNavigationTimeout(60000);

    const page = context.newPage();

    page.goto(tenantUrl, { waitUntil: 'networkidle' })
        .then(() => {
            group('CheckNotification: Visit login page and authorization to tenant portal', function () {
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
            group('CheckNotification: Check and close banner', function () {
                page.waitForSelector('div[aria-label="total-units-stored"] >> nth=0');
                page.waitForTimeout(6000);

                check(page, {
                    'CheckNotification[1/8]: Tenant Dashboard: Page is visible after redirectionion to page': page.locator('div[aria-label="total-units-stored"] >> nth=0').isVisible(),
                    'CheckNotification[2/8]: Tenant Dashboard: Banner is visible and content match': page.locator('div[aria-label="banners-slider-container"] >> nth=0').isVisible() && page.locator('div[aria-label="carousel-item-block-content"] >> nth=0').textContent() == bannerTitle,
                    'CheckNotification[3/8]: Tenant Dashboard: Button (Close Banner) is visible and enabled': page.locator('button[name="close-banner"] >> nth=0').isVisible() && page.locator('button[name="close-banner"] >> nth=0').isEnabled(),
                    'CheckNotification[4/8]: Tenant Dashboard: Button (Notifications) is visible': page.locator('svg[name="open-notifications-menu"]').isVisible(),
                });

                return Promise.all([
                    page.locator('button[name="close-banner"] >> nth=0').click(),
                    page.locator('svg[name="open-notifications-menu"]').click(),
                ]);
            });
        })
        .then(() => {
            group('CheckNotification: Open Notifications Windows and check notification', function () {
                page.waitForSelector('div[aria-label="notifications-menu"]');

                check(page, {
                    'CheckNotification[5/8]: Tenant Dashboard: Notifications window is visible and content match after clicking notifications button': page.locator('div[aria-label="notifications-menu"]').isVisible() && page.locator('div[aria-label="notifications-menu"] > div > h6').textContent() == notificationWindowTitle,
                    'CheckNotification[6/8]: Tenant Dashboard: Button (Close Notifications Menu) is visible and enabled': page.locator('svg[name="close-notifications-menu"]').isVisible() && page.locator('svg[name="close-notifications-menu"]').isEnabled(),
                    'CheckNotification[7/8]: Tenant Dashboard: Notification is visible and content match': page.locator('div[aria-label="notification-container"] >> nth=0').isVisible() && page.locator('div[aria-label="notification-text"] >> nth=0').textContent() == notificationTitle,
                    'CheckNotification[8/8]: Tenant Dashboard: Button (Delete Notification) is visible': page.locator('div[name="delete-notification"] >> nth=0').isVisible(),
                });

                return Promise.all([
                    page.locator('div[name="delete-notification"] >> nth=0').click(),
                ]);
            });
        })
        .then(() => {
            group('CheckNotification: Click Close Notification Menu button', function () {
                page.waitForSelector('div[aria-label="notifications-menu"]');

                return Promise.all([
                    page.locator('svg[name="close-notifications-menu"]').click(),
                ]);
            });
        })
        .then(() => {
            group('CheckNotification: Wait for Dashboard', function () {
                page.waitForSelector('div[aria-label="total-units-stored"] >> nth=0');
            });
        })
        .finally(() => {
            page.close();
            browser.close();
        });
}