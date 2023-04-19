import { check, group } from 'k6';
import { chromium } from 'k6/x/browser';

export function DeleteTenant() {
    const url = 'https://dev.dev.skudrop.com/login';

    const email = 'admin@example.com';
    const password = 'admin';

    const tenantName = "Test";
    const tenantEmail = "voicebyte@me.com";
    const tenantEmailChanged = "k6test@me.com";

    const totalUnitsStoredTitle = "Total Units Stored";
    const tenantListTableTitle = "Tenant List";
    const confirmationRequiredModalTitle = "CONFIRMATION REQUIRED";

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
            group('DeleteTenant: Visit login page and authorization', function () {
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
            group('DeleteTenant: Waiting for Warehouse Dashboard page and go to Tenant List page', function () {
                page.waitForSelector('div[aria-label="total-units-stored"] > h1 >> nth=0');

                check(page, {
                    'DeleteTenant[1/8]: Warehouse Dashboard: Page is visible and content match': page.locator('div[aria-label="total-units-stored"] > p >> nth=0').isVisible() && page.locator('div[aria-label="total-units-stored"] > p >> nth=0').textContent() == totalUnitsStoredTitle,
                });

                return Promise.all([
                    page.waitForNavigation(),
                    page.locator('a[href="/dashboard-warehouse/tenant-list/"]').click(),
                ]);
            });
        })
        .then(() => {
            group('DeleteTenant: Wait for Tenant List page and click Delete Tenant button', function () {
                page.waitForSelector('div[aria-label="tenant-list-container"]');

                page.waitForTimeout(1000);

                check(page, {
                    'DeleteTenant[2/8]: Tenant List: Page is visible and content match': page.locator('div[aria-label="tenant-list-container"]').isVisible() && page.locator('div[aria-label="tenant-list-container"] > h5 >> nth=0').textContent() == tenantListTableTitle,
                    'DeleteTenant[3/8]: Tenant List: Tenant field is visible and has correct User Name and Email': page.locator('tr[about="tenant-field"]').isVisible() && page.locator('td[about="tenant-name"]').textContent() == tenantName && page.locator('td[about="tenant-email"]').textContent() == tenantEmailChanged,
                    'DeleteTenant[4/8]: Tenant List: Button (Visit Tenant) is visible and enabled': page.locator('button[name="visit-tenant-dashboard"] >> nth=0').isVisible() && page.locator('button[name="visit-tenant-dashboard"] >> nth=0').isEnabled(),
                    'DeleteTenant[5/8]: Tenant List: Button (Delete Tenant) is visible and enabled': page.locator('button[name="delete-tenant"] >> nth=0').isVisible() && page.locator('button[name="delete-tenant"] >> nth=0').isEnabled(),
                });

                return Promise.all([
                    page.locator('button[name="delete-tenant"] >> nth=0').click(),
                ]);
            });
        })
        .then(() => {
            group('DeleteTenant: Wait for Tenant List page and click Delete Tenant button', function () {
                page.waitForSelector('div[aria-label="delete-confirmation-modal"]');

                page.waitForTimeout(1000);

                check(page, {
                    'DeleteTenant[6/8]: Tenant List: Modal (Confirmation Required) - Modal is visible and content match': page.locator('div[aria-label="delete-confirmation-modal"]').isVisible() && page.locator('div.modal-title').textContent() == confirmationRequiredModalTitle,
                    'DeleteTenant[7/8]: Tenant List: Modal (Confirmation Required) - Button (Cancel) is visible and enabled': page.locator('button[name="cancel-deletion"]').isVisible() && page.locator('button[name="cancel-deletion"]').isEnabled(),
                    'DeleteTenant[8/8]: Tenant List: Modal (Confirmation Required) - Button (Delete) is visible and enabled': page.locator('button[name="confirm-deletion"]').isVisible() && page.locator('button[name="confirm-deletion"]').isEnabled(),
                });

                return Promise.all([
                    page.locator('button[name="confirm-deletion"]').click(),
                ]);
            });
        })
        .then(() => {
            group('DeleteTenant: Wait for Tenant List page', function () {
                page.waitForSelector('div[aria-label="tenant-list-container"]');
            });
        })
        .finally(() => {
            page.close();
            browser.close();
        });
}