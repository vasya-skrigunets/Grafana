import { check, group } from 'k6';
import { chromium } from 'k6/x/browser';

export function SendProductToAmazon() {
    const url = 'https://test.dev.skudrop.com/';

    const email = 'admin@example.com';
    const password = 'admin';

    const homepageText = "WE STOP YOU LOSING MONEY IN YOUR SUPPLY CHAIN";
    const loginPageText = "Log In to SKUdrop";
    const totalUnitsStoredText = "Total Units Stored";
    const stepTitle1 = "STEP 1 - Select shipping method and number of cartons";
    const stepTitle2 = "STEP 2 - Shipping costs estimation";
    const allDoneModalTitle = "ALL DONE!";

    const numberOfCartons = "1";
    let cartonsInPrepBefore, cartonsInPrepAfter = 0;

    // browser settings
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
            // groups are used to organize results in a test
            group('SendProductToAmazon: Visit main page and redirection to Login Page', function () {
                // waitForSelector returns when element specified by selector satisfies state option
                page.waitForSelector('div[aria-label="hero-section"]');
                // check is a test condition that can give a truthy or falsy result
                check(page, {
                    // locator makes it easier to work with dynamically changing elements
                    'SendProductToAmazon[1/22]: Home Page: Content is matching': page.locator('span[aria-label="hero-section-title"]').textContent() == homepageText,
                    'SendProductToAmazon[2/22]: Home Page: Content is visible': page.locator('div[aria-label="hero-section"]').isVisible(),
                });
                
                return Promise.all([
                    // waitForNavigation waits for the main frame navigation and returns the main resource response
                    page.waitForNavigation(),
                    // click method clicks an element that matching selector
                    page.locator('button[name="landing-page_login-button"]').click(),
                ]);
            });
        })
        .then(() => {
            group('SendProductToAmazon: Check login page and authorization', function () {
                page.waitForSelector('h4[aria-label="login-page-title"]');

                check(page, {
                    // textContent returns element.textContent
                    'SendProductToAmazon[3/22]: Login Page: Content is matching': page.locator('img[alt="logo"]').isVisible() && page.locator('h4[aria-label="login-page-title"]').textContent() == loginPageText,
                    // isVisible, isEnabled, isDisabled, isEditable, isChecked, isClosed, isHidden methods return true or false about the element according to their name
                    'SendProductToAmazon[4/22]: Login Page: Form is editable': page.locator('input[name="email"]').isEditable() && page.locator('input[name="password"]').isEditable(),
                });

                // type sends a keyDown, keyPress/input, and keyUp event for each character in the text
                page.locator('input[name="email"]').fill(email);
                page.locator('input[name="password"]').fill(password);

                check(page, {
                    'SendProductToAmazon[5/22]: Login Page: Button is visible and enabled': page.locator('button[name="login-page_login-button"]').isVisible() && page.locator('button[name="login-page_login-button"]').isEnabled(),
                });

                return Promise.all([
                    page.waitForNavigation(),
                    page.locator('button[name="login-page_login-button"]').click(),
                ]);
            });
        })
        .then(() => {
            group('SendProductToAmazon: Waiting for Warehouse page and redirecting to Send Product To Amazon page', function () {
                page.waitForSelector('div[aria-label="cartons-in-preparation"] > div > h1 >> nth=0');
                page.waitForTimeout(500);

                cartonsInPrepBefore = parseFloat(page.locator('div[aria-label="cartons-in-preparation"] > div > h1 >> nth=0').textContent());

                check(page, {
                    'SendProductToAmazon[6/22]: Dasboard: Content is matching': page.locator('div[aria-label="total-units-stored"] > p >> nth=0').isVisible() && page.locator('div[aria-label="total-units-stored"] > p >> nth=0').textContent() == totalUnitsStoredText,
                    'SendProductToAmazon[7/22]: Dasboard: Send product to amazon button is visible': page.locator('a[href="/dashboard/send-product-to-amazon"]').isVisible(),
                });

                return Promise.all([
                    page.waitForNavigation(),
                    page.locator('a[href="/dashboard/send-product-to-amazon"]').click(),
                ]);
            });
        })
        .then(() => {
            group('SendProductToAmazon: Check Send Product To Amazon page, fill in number of cartons and click Create Shipping Plan button', function () {
                page.waitForSelector('label[aria-label="first-step-label"]');
                check(page, {
                    'SendProductToAmazon[8/22]: Send Product To Amazon: Step 1 - Content is matching': page.locator('label[aria-label="first-step-label"]').textContent() == stepTitle1,
                    'SendProductToAmazon[9/22]: Send Product To Amazon: Step 1 - Number of cartons is editable (NameTwoHs)': page.locator('input[name="0be3a60e-b103-4af2-b52e-fad63df756c3"]').isEditable(),
                    'SendProductToAmazon[10/22]: Send Product To Amazon: Step 1 - Button (Create Shipping Plan With Seller Central) is visible and enabled': page.locator('button[name="create-shipping-plan-with-seller-central"]').isVisible() && page.locator('button[name="create-shipping-plan-with-seller-central"]').isEnabled(),
                });

                // fill method waits for an element matching selector, waits for actionability checks, focuses the element, fills it and triggers an input event after filling
                page.locator('input[name="0be3a60e-b103-4af2-b52e-fad63df756c3"]').fill('');
                page.locator('input[name="0be3a60e-b103-4af2-b52e-fad63df756c3"]').type(numberOfCartons);
                
                return Promise.all([
                    page.locator('button[name="create-shipping-plan-with-seller-central"]').click(),
                ]);
            });
        })
        .then(() => {
            group('SendProductToAmazon: Wait for Shipment Details and click Calculate Shipping Estimate button', function () {
                page.waitForSelector('button[name="calculate-shipping-estimate"]');

                check(page, {
                    'SendProductToAmazon[11/22]: Send Product To Amazon: Step 1 - Button (Calculate Shipping Estimate) is visible and enabled': page.locator('button[name="calculate-shipping-estimate"]').isVisible() && page.locator('button[name="calculate-shipping-estimate"]').isEnabled(),
                });

                return Promise.all([
                    page.locator('button[name="calculate-shipping-estimate"]').click(),
                ]);
            });
        })
        .then(() => {
            group('SendProductToAmazon: Check Regular UPS Delivery option and click Confirm Shipping Plan button', function () {
                page.waitForSelector('label[aria-label="second-step-label"]');

                check(page, {
                    'SendProductToAmazon[12/22]: Send Product To Amazon: Step 2 - Content is updated': page.locator('label[aria-label="second-step-label"]').textContent() == stepTitle2,
                    'SendProductToAmazon[13/22]: Send Product To Amazon: Step 2 - Checkbox (Regular UPS Delivery) is visible and enabled': page.locator('input[name="delivery_type_Truck delivery_Regular"]').isVisible() && page.locator('input[name="delivery_type_Truck delivery_Regular"]').isEnabled(),
                    'SendProductToAmazon[14/22]: Send Product To Amazon: Step 2 - Button (Confirm Shipping Plan) is visible and disabled': page.locator('button[name="confirm-shipping-plan"]').isVisible() && page.locator('button[name="confirm-shipping-plan"]').isDisabled(),
                });

                // check method checks an element that matching selector
                page.locator('input[name="delivery_type_Truck delivery_Regular"]').check();

                check(page, {
                    'SendProductToAmazon[15/22]: Send Product To Amazon: Step 2 - Checkbox (Regular UPS Delivery) is cheked': page.locator('input[name="delivery_type_Truck delivery_Regular"]').isChecked(),
                });

                page.waitForSelector('button[name="confirm-shipping-plan"]');

                check(page, {
                    'SendProductToAmazon[16/22]: Send Product To Amazon: Step 2 - Button (Confirm Shipping Plan) is visible and enabled': page.locator('button[name="confirm-shipping-plan"]').isVisible() && page.locator('button[name="confirm-shipping-plan"]').isEnabled(),
                });

                return Promise.all([
                    page.locator('button[name="confirm-shipping-plan"]').click(),
                ]);
            });
        })
        .then(() => {
            group('SendProductToAmazon: Check All Done modal and click Go To Dashboard button', function () {
                page.waitForSelector('div[aria-label="all-done-modal"]');

                check(page, {
                    'SendProductToAmazon[17/22]: Send Product To Amazon: Modal (All Done) - Dialog is visible': page.locator('div[aria-label="all-done-modal"]').isVisible(),
                    'SendProductToAmazon[18/22]: Send Product To Amazon: Modal (All Done) - Content is matched': page.locator('img[alt="done"]').isVisible() && page.locator('h3[class="text-center mb-3"]').textContent() == allDoneModalTitle,
                    'SendProductToAmazon[19/22]: Send Product To Amazon: Modal (All Done) - Video is available and visible': page.locator('video[id="video"]').isVisible(),
                    'SendProductToAmazon[20/22]: Send Product To Amazon: Modal (All Done) - Button (Go to dashboard) is visible and enabled': page.locator('button[name="go-to-dashboard"]').isVisible() && page.locator('button[name="go-to-dashboard"]').isEnabled(),
                });

                return Promise.all([
                    page.waitForNavigation(),
                    page.locator('button[name="go-to-dashboard"]').click(),
                ]);
            });
        })
        .then(() => {
            group('SendProductToAmazon: Check redirection to Dasboard and check the changing Cartons in Prep value', function () {
                page.waitForSelector('div[aria-label="cartons-in-preparation"] > div > h1 >> nth=0');
                page.waitForTimeout(500);

                cartonsInPrepAfter = parseFloat(page.locator('div[aria-label="cartons-in-preparation"] > div > h1 >> nth=0').textContent());

                check(page, {
                    'SendProductToAmazon[21/22]: Dashboard: Redirect is successful': page.locator('button[id="Dashboard-tab-TotalStorage"]').isVisible(),
                    'SendProductToAmazon[22/22]: Dashboard: Cartons in prep value changed': cartonsInPrepBefore < cartonsInPrepAfter,
                });
            });
        })
        .finally(() => {
            page.close();
            browser.close();
        });
}