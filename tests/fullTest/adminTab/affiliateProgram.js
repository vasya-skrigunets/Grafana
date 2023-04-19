import { check, group } from 'k6';
import { chromium } from 'k6/x/browser';

export function AffiliateProgram() {
    const url = 'https://dev.dev.skudrop.com/login';

    const email = 'admin@example.com';
    const password = 'admin';

    const firstName = "K6Name";
    const lastName = "K6Last";
    const affiliateEmail = "k6test@mail.com";
    const communityName = "K6Test";
    const codeNameTmp = "Tmp";
    const codeName = "Test";

    const subscriptionPeriodDropdownOption_FreeForever = 'FREE_FOREVER';

    const incominigCartonsTableTitle = "Incoming cartons";
    const emptyAffiliateTitle = "THERE ARE NO AFFILIATES";
    const createNewAffiliateModalTitle = "Create new affiliate";

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
            group('AffiliateProgram: Visit login page and authorization', function () {
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
            group('AffiliateProgram: Waiting for Warehouse Dashboard page and redirecting to Affiliate Program page', function () {
                page.waitForSelector('div[aria-label="total-units-stored"] > h1 >> nth=0');

                check(page, {
                    'AffiliateProgram[1/13]: Warehouse Dashboard: Content is visible and matched after login': page.locator('img[alt="LOGO"]').isVisible() && page.locator('h5[aria-label="incoming-cartons-table-title"]').textContent() == incominigCartonsTableTitle,
                });

                return Promise.all([
                    page.waitForNavigation(),
                    page.locator('a[href="/dashboard-warehouse/affiliate/"]').click(),
                ]);
            });
        })
        .then(() => {
            group('AffiliateProgram: Check Affiliate Program page and click Create New Affiliate button', function () {
                page.waitForSelector('div[aria-label="affiliates-table"]');

                check(page, {
                    'AffiliateProgram[2/13]: Affiliate Program: Tab is visible and content matched when the tab button is clicked': page.locator('div[aria-label="affiliates-table"]').isVisible() && page.locator('div[aria-label="affiliates-table"] > h6').textContent() == emptyAffiliateTitle,
                    'AffiliateProgram[3/13]: Affiliate Program: Button (Create New Affiliate) is visible and enabled': page.locator('button[name="create-new-affiliate"]').isVisible() && page.locator('button[name="create-new-affiliate"]').isEnabled(),
                });

                return Promise.all([
                    page.locator('button[name="create-new-affiliate"]').click(),
                ]);
            });
        })
        .then(() => {
            group('AffiliateProgram: Check Create new affiliate modal and fill in data', function () {
                page.waitForSelector('div[aria-label="new-affiliate-modal"]');

                check(page, {
                    'AffiliateProgram[4/13]: Affiliate Program: Modal (Create new affiliate) - Modal is visible and content match': page.locator('div[aria-label="new-affiliate-modal"]').isVisible() && page.locator('div.modal-title').textContent() == createNewAffiliateModalTitle,
                    'AffiliateProgram[5/13]: Affiliate Program: Modal (Create new affiliate) - Inputs (User Name) are editable': page.locator('input[name="first_name"]').isEditable() && page.locator('input[name="last_name"]').isEditable(),
                    'AffiliateProgram[6/13]: Affiliate Program: Modal (Create new affiliate) - Input (Email) is editable': page.locator('input[name="email"]').isEditable(),
                    'AffiliateProgram[7/13]: Affiliate Program: Modal (Create new affiliate) - Input (Community Name) is editable': page.locator('input[name="community_name"]').isEditable(),
                    'AffiliateProgram[8/13]: Affiliate Program: Modal (Create new affiliate) - Input (Code Name) is editable': page.locator('input[name="code"]').isEditable(),
                    'AffiliateProgram[9/13]: Affiliate Program: Modal (Create new affiliate) - Button (Save Affiliate Details) is visible and enabled': page.locator('button[name="save-affiliate-details"]').isVisible() && page.locator('button[name="save-affiliate-details"]').isEnabled(),
                });
                
                page.locator('input[name="first_name"]').fill(firstName);
                page.locator('input[name="last_name"]').fill(lastName);
                page.locator('input[name="email"]').fill(affiliateEmail);
                page.locator('input[name="community_name"]').fill(communityName);
                page.locator('input[name="code"]').fill(codeNameTmp);

                page.locator('select[name="free_subscription_period"]').selectOption(subscriptionPeriodDropdownOption_FreeForever);
                
                return Promise.all([
                    page.locator('button[name="save-affiliate-details"]').click(),
                ])
            });
        })
        .then(() => {
            group('AffiliateProgram: Check created affiliate and deleting it', function () {
                page.waitForSelector('div[aria-label="affiliate-code"]');

                check(page, {
                    'AffiliateProgram[10/13]: Affiliate Program: Affiliate created with required code': page.locator('div[aria-label="affiliate-code"] > p').textContent() == codeNameTmp,
                    'AffiliateProgram[11/13]: Affiliate Program: Dropdown Button (Action) is visible and enabled': page.locator('button[name="affiliate-action"]').isVisible() && page.locator('button[name="affiliate-action"]').isEnabled(),
                });

                page.locator('button[name="affiliate-action"]').click();

                page.waitForSelector('a[about="delete-code"]');

                return Promise.all([
                    page.locator('a[about="delete-code"]').click(),
                ])
            });
        })
        .then(() => {
            group('AffiliateProgram: Check deletion and creating new affiliate', function () {
                page.waitForSelector('div[aria-label="affiliates-table"]');

                check(page, {
                    'AffiliateProgram[12/13]: Affiliate Program: Affiliate was successfull deleted': page.locator('div[aria-label="affiliates-table"] > h6').textContent() == emptyAffiliateTitle,
                });
                
                return Promise.all([
                    page.locator('button[name="create-new-affiliate"]').click(),
                ])
            });
        })
        .then(() => {
            group('AffiliateProgram: Fill in affiliate data', function () {
                page.waitForSelector('div[aria-label="affiliates-table"]');

                page.locator('input[name="first_name"]').fill(firstName);
                page.locator('input[name="last_name"]').fill(lastName);
                page.locator('input[name="email"]').fill(affiliateEmail);
                page.locator('input[name="community_name"]').fill(communityName);
                page.locator('input[name="code"]').fill(codeName);

                page.locator('select[name="free_subscription_period"]').selectOption(subscriptionPeriodDropdownOption_FreeForever);
                
                return Promise.all([
                    page.locator('button[name="save-affiliate-details"]').click(),
                ])
            });
        })
        .then(() => {
            group('AffiliateProgram: Check New Affiliate creation', function () {
                page.waitForSelector('div[aria-label="affiliate-code"]');

                check(page, {
                    'AffiliateProgram[13/13]: Affiliate Program: New Affiliate created successfull': page.locator('div[aria-label="affiliate-code"] > p').textContent() == codeName,
                });
            });
        })
        .finally(() => {
            page.close();
            browser.close();
        });
}