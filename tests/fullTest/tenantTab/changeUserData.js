import { check, group } from 'k6';
import { chromium } from 'k6/x/browser';

export function ChangeUserData() {
    const url = 'https://test.dev.skudrop.com/login';

    const email = 'voicebyte@me.com';
    const password = 'test';
    const newEmail = 'k6test@me.com';
    const newPassword = 'k6testpswd';

    const newCreditCardNumber = '4242424242424242';
    const newCreditCardExpire = '0428';
    const newCreditCardCVV = '424';

    const creditCardExpirePlaceholder = "4/28";

    const totalUnitsStoredTitle = "Total Units Stored";
    const userDetailsSettingsTitle = "User Details";

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
            group('ChangeUserData: Visit login page and authorization', function () {
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
            group('ChangeUserData: Waiting for Dashboard page and redirecting to Settings page', function () {
                page.waitForSelector('div[aria-label="total-units-stored"] > h1 >> nth=0');

                check(page, {
                    'ChangeUserData[1/14]: Dashboard: Content is visible and matched after login': page.locator('img[alt="LOGO"]').isVisible() && page.locator('div[aria-label="total-units-stored"] > p >> nth=0').textContent() == totalUnitsStoredTitle,
                });

                return Promise.all([
                    page.waitForNavigation(),
                    page.locator('svg[name="settings-button"]').click(),
                ]);
            });
        })
        .then(() => {
            group('ChangeUserData: Check Settings page and change email', function () {
                page.waitForSelector('div[aria-label="user-settings-page"]');
                page.waitForTimeout(3000);

                check(page, {
                    'ChangeUserData[2/14]: Settings: Page is visible and content matched when the tab button is clicked': page.locator('div[aria-label="user-settings-page"]').isVisible() && page.locator('label[aria-label="user-details-section-label"]').textContent() == userDetailsSettingsTitle,
                    'ChangeUserData[3/14]: Settings: Input (Email) is visible and editable': page.locator('input[name="email"]').isVisible() && page.locator('input[name="email"]').isEditable(),
                    'ChangeUserData[4/14]: Settings: Input (Current password) is visible and editable': page.locator('input[name="currentPassword"]').isVisible() && page.locator('input[name="currentPassword"]').isEditable(),
                    'ChangeUserData[5/14]: Settings: Input (New password) is visible and editable': page.locator('input[name="newPassword"]').isVisible() && page.locator('input[name="newPassword"]').isEditable(),
                    'ChangeUserData[6/14]: Settings: Input (Confirm password) is visible and editable': page.locator('input[name="confirmPassword"]').isVisible() && page.locator('input[name="confirmPassword"]').isEditable(),
                    'ChangeUserData[7/14]: Settings: Input (Credit card number) is visible and editable': page.locator('div[id="card-number"] > div > input').isVisible() && page.locator('div[id="card-number"] > div > input').isEditable(),
                    'ChangeUserData[8/14]: Settings: Input (Expire card date) is visible and editable': page.locator('div[id="card-expire"] > div > input').isVisible() && page.locator('div[id="card-expire"] > div > input').isEditable(),
                    'ChangeUserData[9/14]: Settings: Input (CVV) is visible and editable': page.locator('div[id="card-cvv"] > div > input').isVisible() && page.locator('div[id="card-cvv"] > div > input').isEditable(),
                    'ChangeUserData[10/14]: Settings: Button (Save User Details) is visible and enabled': page.locator('button[name="save-user-details"]').isVisible() && page.locator('button[name="save-user-details"]').isEnabled(),
                    'ChangeUserData[11/14]: Settings: Button (Save Password) is visible and enabled': page.locator('button[name="save-password"]').isVisible() && page.locator('button[name="save-password"]').isEnabled(),
                    'ChangeUserData[12/14]: Settings: Button (Save Credit Card) is visible and enabled': page.locator('button[name="save-credit-card"]').isVisible() && page.locator('button[name="save-credit-card"]').isEnabled(),
                });

                page.locator('input[name="email"]').fill('');
                page.locator('input[name="email"]').fill(newEmail);

                return Promise.all([
                    page.locator('button[name="save-user-details"]').click(),
                ]);
            });
        })
        .then(() => {
            group('ChangeUserData: Waiting for updating Settings page and change password', function () {
                page.waitForSelector('div[aria-label="user-settings-page"]');

                check(page, {
                    'ChangeUserData[13/14]: Settings: Email is changed after saving': page.locator('input[name="email"]').inputValue() == newEmail,
                });

                page.locator('input[name="currentPassword"]').fill('');
                page.locator('input[name="currentPassword"]').fill(password);
                page.locator('input[name="newPassword"]').fill('');
                page.locator('input[name="newPassword"]').fill(newPassword);
                page.locator('input[name="confirmPassword"]').fill('');
                page.locator('input[name="confirmPassword"]').fill(newPassword);

                return Promise.all([
                    page.locator('button[name="save-password"]').click(),
                ]);
            });
        })
        .then(() => {
            group('ChangeUserData: Fill in new Credit Card data', function () {
                page.waitForSelector('div[aria-label="user-settings-page"]');

                page.waitForTimeout(750);
                page.locator('div[id="card-number"] > div > input').type(newCreditCardNumber, { delay: 25 });
                page.waitForTimeout(750);
                page.locator('div[id="card-expire"] > div > input').type(newCreditCardExpire, { delay: 25 });
                page.waitForTimeout(750);
                page.locator('div[id="card-cvv"] > div > input').type(newCreditCardCVV, { delay: 25 });

                return Promise.all([
                    page.locator('button[name="save-credit-card"]').click(),
                    page.waitForTimeout(2000),
                ]);
            });
        })
        .then(() => {
            group('ChangeUserData: Log out from account', function () {
                page.waitForSelector('div[aria-label="user-settings-page"]');

                page.locator('button[name="user-menu"]').click();
                page.waitForSelector('a[href="#"]');
                
                return Promise.all([
                    page.waitForNavigation(),
                    page.locator('a[href="#"]').click(),
                ]);
            });
        })
        .then(() => {
            group('ChangeUserData: Go to login page', function () {
                page.waitForSelector('div[aria-label="hero-section"]');
                
                return Promise.all([
                    page.waitForNavigation(),
                    page.locator('button[name="landing-page_login-button"]').click(),
                ]);
            });
        })
        .then(() => {
            group('ChangeUserData: Log in with new account data', function () {
                page.waitForSelector('h4[aria-label="login-page-title"]');

                page.locator('input[name="email"]').fill(newEmail);
                page.locator('input[name="password"]').fill(newPassword);

                return Promise.all([
                    page.waitForNavigation(),
                    page.locator('button[name="login-page_login-button"]').click(),
                ]);
            });
        })
        .then(() => {
            group('ChangeUserData: Waiting for Warehouse page', function () {
                page.waitForSelector('div[aria-label="total-units-stored"] > h1 >> nth=0');
                page.waitForTimeout(1000);

                check(page, {
                    'ChangeUserData[14/14]: Settings: User data is changed successful': page.locator('div[aria-label="total-units-stored"] > p >> nth=0').isVisible() && page.locator('div[aria-label="total-units-stored"] > p >> nth=0').textContent() == totalUnitsStoredTitle,
                });

                // return Promise.all([
                //     page.waitForNavigation(),
                //     page.locator('svg[name="settings-button"]').click(),
                // ]);
            });
        })
        // .then(() => {
        //     group('ChangeUserData: Changing email to the previous one', function () {
        //         page.waitForSelector('div[aria-label="user-settings-page"]');

        //         page.locator('input[name="email"]').fill('');
        //         page.locator('input[name="email"]').fill(email);

        //         return Promise.all([
        //             page.locator('button[name="save-user-details"]').click(),
        //         ]);
        //     });
        // })
        // .then(() => {
        //     group('ChangeUserData: Check email changing to the previous one', function () {
        //         page.waitForSelector('div[aria-label="user-settings-page"]');
        //         page.waitForTimeout(1000);

        //         // check(page, {
        //         //     'ChangeUserData[15/14]: Settings: Previous email is saved': page.locator('input[name="email"]').inputValue() == email,
        //         // });

        //         // page.locator('input[name="currentPassword"]').fill('');
        //         // page.locator('input[name="currentPassword"]').fill(newPassword);
        //         // page.locator('input[name="newPassword"]').fill('');
        //         // page.locator('input[name="newPassword"]').fill(password + password);
        //         // page.locator('input[name="confirmPassword"]').fill('');
        //         // page.locator('input[name="confirmPassword"]').fill(password + password);

        //         // return Promise.all([
        //         //     page.locator('button[name="save-password"]').click(),
        //         // ]);
        //     });
        // })
        .finally(() => {
            page.close();
            browser.close();
        });
}