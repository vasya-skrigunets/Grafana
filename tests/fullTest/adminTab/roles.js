import { check, group } from 'k6';
import { chromium } from 'k6/x/browser';

export function Roles() {
    const url = 'https://dev.dev.skudrop.com/login';

    const email = 'admin@example.com';
    const password = 'admin';

    const userEmail = "k6test@email.com";
    const userName = "k6test ";
    
    const userRoleDropdownOption_Manager = "MANAGER";
    const userRoleDropdownOption_Administrator = "ADMINISTRATOR";

    const rolesPageTitle = "Assign Role";
    const changeRoleModalTitle = "Change Role";

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
            group('Roles: Visit login page and authorization', function () {
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
            group('Roles: Waiting for Warehouse Dashboard page and redirecting to Roles page', function () {
                page.waitForSelector('div[aria-label="total-units-stored"] > h1 >> nth=0');
    
                return Promise.all([
                    page.waitForNavigation(),
                    page.locator('a[href="/dashboard-warehouse/roles/"]').click(),
                ]);
            });
        })
        .then(() => {
            group('Roles: Check Roles page fill in Email, select role and click Add button', function () {
                page.waitForSelector('div[aria-label="users-roles"]');

                check(page, {
                    'Roles[1/11]: Roles: Page is visible and content match after redirection to page': page.locator('div[aria-label="users-roles"]').isVisible() && page.locator('div[aria-label="users-roles"] > form > div > h5').textContent() == rolesPageTitle,
                    'Roles[2/11]: Roles: Input (Email) is visible and editable': page.locator('input[name="email"]').isVisible() && page.locator('input[name="email"]').isEditable(),
                    'Roles[3/11]: Roles: Dropdown (Manage roles) is visible': page.locator('select[name="role-selection"]').isVisible(),
                    'Roles[4/11]: Roles: Button (Add) is visible and enabled': page.locator('button[name="add-user-role"]').isVisible() && page.locator('button[name="add-user-role"]').isEnabled(),
                });

                page.locator('input[name="email"]').fill(userEmail);
                page.waitForTimeout(500);
                page.locator('select[name="role-selection"]').selectOption(userRoleDropdownOption_Manager);
                page.waitForTimeout(500);
                
                return Promise.all([
                    page.locator('button[name="add-user-role"]').click(),
                ]);
            });
        })
        .then(() => {
            group('Roles: Wait for Roles page and click Change Role button', function () {
                page.waitForSelector('div[aria-label="users-roles-table"]');
                page.waitForTimeout(500);

                check(page, {
                    'Roles[5/11]: Roles: User has been added to table': page.locator('td[about="user-name"] >> nth=0').textContent() == userName,
                    'Roles[6/11]: Roles: User has been added to table with correct role': page.locator('td[about="user-role"] >> nth=0').textContent() == userRoleDropdownOption_Manager,
                    'Roles[7/11]: Roles: Button (Change Role) is visible and enabled': page.locator('button[name="change-role"] >> nth=0').isVisible() && page.locator('button[name="change-role"] >> nth=0').isEnabled(),
                });

                return Promise.all([
                    page.locator('button[name="change-role"] >> nth=0').click(),
                ]);
            });
        })
        .then(() => {
            group('Roles: Check Change Role modal, change user role and click Save button', function () {
                page.waitForSelector('div[aria-label="change-role-modal"]');

                check(page, {
                    'Roles[8/11]: Roles: Modal (Change Role) - Modal is visible and content match after clicking change role button': page.locator('div[aria-label="change-role-modal"]').isVisible() && page.locator('div.modal-title').textContent() == changeRoleModalTitle,
                    'Roles[9/11]: Roles: Modal (Change Role) - Dropdown (Role) is visible': page.locator('select[name="change-role-selection"]').isVisible(),
                    'Roles[10/11]: Roles: Modal (Change Role) - Button (Save) is visible and enabled': page.locator('button[name="save-role"]').isVisible() && page.locator('button[name="save-role"]').isEnabled(),
                });

                page.locator('select[name="change-role-selection"]').selectOption(userRoleDropdownOption_Administrator);
                page.waitForTimeout(500);

                return Promise.all([
                    page.locator('button[name="save-role"]').click(),
                ]);
            });
        })
        .then(() => {
            group('Roles: Check user role changing', function () {
                page.waitForSelector('div[aria-label="users-roles-table"]');
                page.waitForTimeout(1000);

                check(page, {
                    'Roles[11/11]: Roles: User role is changed successful': page.locator('td[about="user-role"] >> nth=0').textContent() == userRoleDropdownOption_Administrator,
                });
            });
        })
        .finally(() => {
            page.close();
            browser.close();
        });
}