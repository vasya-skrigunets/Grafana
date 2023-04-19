import { check, group } from 'k6';
import { chromium } from 'k6/x/browser';

export function ApplyAffiliate() {
    const url = 'https://test.dev.skudrop.com/login';

    const email = 'admin@example.com';
    const password = 'admin';

    const codeName = "Test";
    const subscriptionPeriod = "Free for life";
    const feeDiscount = "0%";
    const feeDiscountPeriod = "-";

    const totalUnitsStoredTitle = "Total Units Stored";
    const userDetailsSettingsTitle = "User Details";
    const activeAffiliateCodeText = "Active code: " + codeName;

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
            group('ApplyAffiliate: Visit login page and authorization', function () {
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
            group('ApplyAffiliate: Waiting for Dashboard page and redirecting to Settings page', function () {
                page.waitForSelector('div[aria-label="total-units-stored"] > h1 >> nth=0');

                check(page, {
                    'ApplyAffiliate[1/8]: Dashboard: Content is visible and matched after login': page.locator('img[alt="LOGO"]').isVisible() && page.locator('div[aria-label="total-units-stored"] > p >> nth=0').textContent() == totalUnitsStoredTitle,
                });

                return Promise.all([
                    page.waitForNavigation(),
                    page.locator('svg[name="settings-button"]').click(),
                ]);
            });
        })
        .then(() => {
            group('ApplyAffiliate: Check Settings page and fill in Affiliate code', function () {
                page.waitForSelector('div[aria-label="user-settings-page"]');
                page.waitForSelector('input[name="code"]');

                check(page, {
                    'ApplyAffiliate[2/8]: Settings: Page is visible and content matched when the tab button is clicked': page.locator('div[aria-label="user-settings-page"]').isVisible() && page.locator('label[aria-label="user-details-section-label"]').textContent() == userDetailsSettingsTitle,
                    'ApplyAffiliate[3/8]: Settings: Input (Code) is editable': page.locator('input[name="code"]').isEditable(),
                    'ApplyAffiliate[4/8]: Settings: Button (Save Affiliate Code) is visible and enabled': page.locator('button[name="save-affiliate-code"]').isVisible() && page.locator('button[name="save-affiliate-code"]').isEnabled(),
                });

                page.locator('input[name="code"]').fill(codeName);

                return Promise.all([
                    page.locator('button[name="save-affiliate-code"]').click(),
                ]);
            });
        })
        .then(() => {
            group('ApplyAffiliate: Check applied Affiliate Code', function () {
                page.waitForSelector('div[aria-label="active-affiliate-code"]');

                check(page, {
                    'ApplyAffiliate[5/8]: Settings: Affiliate code is correct': page.locator('div[aria-label="active-affiliate-code"] > h6').textContent() == activeAffiliateCodeText,
                    'ApplyAffiliate[6/8]: Settings: Affiliate subscription period is correct': page.locator('div[aria-label="subscription-period"]').textContent() == subscriptionPeriod,
                    'ApplyAffiliate[7/8]: Settings: Affiliate discount is correct': page.locator('div[aria-label="fee-discount"]').textContent() == feeDiscount,
                    'ApplyAffiliate[8/8]: Settings: Affiliate discount period is correct': page.locator('div[aria-label="fee-discount-period"]').textContent() == feeDiscountPeriod,
                });
            });
        })
        .finally(() => {
            page.close();
            browser.close();
        });
}