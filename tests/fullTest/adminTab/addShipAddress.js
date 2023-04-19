import { check, group } from 'k6';
import { chromium } from 'k6/x/browser';

export function AddShipAddress() {
    const url = 'https://dev.dev.skudrop.com/login';

    const email = 'admin@example.com';
    const password = 'admin';

    const addressLine1 = "K6 Test Addres";
    const addressLineEdited1 = "K6 Test Addres Edited";
    const city = "K6 Test City";
    const state = "K6 Test State";
    const postalCode = "78956";
    const countyCode = "JP";

    const shipFronAddressTableTitle = "Ship From Address";
    const addAddressModalTitle = "Add Address";
    const editAddressModalTitle = "Warehouse Details";
    const confirmShipAddressDeletionModalTitle = "CONFIRMATION REQUIRED";

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
            group('AddShipAddress: Visit login page and authorization', function () {
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
            group('AddShipAddress: Waiting for Warehouse Dashboard page and redirecting to Tenant List page', function () {
                page.waitForSelector('div[aria-label="total-units-stored"] > h1 >> nth=0');

                return Promise.all([
                    page.waitForNavigation(),
                    page.locator('a[href="/dashboard-warehouse/tenant-list/"]').click(),
                ]);
            });
        })
        .then(() => {
            group('AddShipAddress: Waiting for Tenant List page and redirecting to Ship From Address tab', function () {
                page.waitForSelector('div[id="Dashboard-tabpane-Skudrop"]');
                page.waitForTimeout(1000);

                return Promise.all([
                    page.locator('button[id="Dashboard-tab-Amazon"]').click(),
                ]);
            });
        })
        .then(() => {
            group('AddShipAddress: Wait for Ship From Address table and click Add Address button', function () {
                page.waitForSelector('div[aria-label="ship-from-address-table"]');

                check(page, {
                    'AddShipAddress[1/16]: Tenant list: Ship From Address: Table is visible and content match after redirection to tab': page.locator('div[aria-label="ship-from-address-table"]').isVisible() && page.locator('div[aria-label="ship-from-address-table"] > h5').textContent() == shipFronAddressTableTitle,
                    'AddShipAddress[2/16]: Tenant list: Ship From Address: Button (Add Address) is visible and enabled': page.locator('button[name="add-address"]').isVisible() && page.locator('button[name="add-address"]').isEnabled(),
                });

                return Promise.all([
                    page.locator('button[name="add-address"]').click(),
                ]);
            });
        })
        .then(() => {
            group('AddShipAddress: Open the add address modal and fill in the data', function () {
                page.waitForSelector('div[aria-label="add-address-modal"]');

                check(page, {
                    'AddShipAddress[3/16]: Tenant list: Ship From Address: Modal (Add Address) is visible and content match after clicking add address button': page.locator('div[aria-label="add-address-modal"]').isVisible() && page.locator('div.modal-title').textContent() == addAddressModalTitle,
                    'AddShipAddress[4/16]: Tenant list: Ship From Address: Modal (Add Address) Dropdown (Coutry Code) is visible': page.locator('select[name="country_code"]').isVisible(),
                    'AddShipAddress[5/16]: Tenant list: Ship From Address: Modal (Add Address) Inputs are editable': page.locator('input[name="address_line1"]').isEditable() && page.locator('input[name="city"]').isEditable(),
                    'AddShipAddress[6/16]: Tenant list: Ship From Address: Modal (Add Address) Button (Add) is visible and enabled': page.locator('button[name="add-address-modal"]').isVisible() && page.locator('button[name="add-address-modal"]').isEnabled(),
                });

                page.locator('input[name="address_line1"]').fill(addressLine1);
                page.locator('input[name="city"]').fill(city);
                page.locator('input[name="state_or_province_code"]').fill(state);
                page.locator('input[name="postal_code"]').fill(postalCode);
                page.locator('select[name="country_code"]').selectOption(countyCode);

                return Promise.all([
                    page.locator('button[name="add-address-modal"]').click(),
                ]);
            });
        })
        .then(() => {
            group('AddShipAddress: Check the creation of the address and click Edit button', function () {
                page.waitForSelector('div[aria-label="ship-from-address-table"]');
                page.waitForTimeout(1000);

                check(page, {
                    'AddShipAddress[7/16]: Tenant list: Ship From Address: Address has been added': page.locator('td[about="address-name"] >> nth=-1').textContent() == addressLine1,
                    'AddShipAddress[8/16]: Tenant list: Ship From Address: Button (Edit Address) is visible and enabled': page.locator('button[name="edit-address"] >> nth=-1').isVisible() && page.locator('button[name="edit-address"] >> nth=-1').isEnabled(),
                });

                return Promise.all([
                    page.locator('button[name="edit-address"] >> nth=-1').click(),
                ]);
            });
        })
        .then(() => {
            group('AddShipAddress: Check Edit Address modal, address data and fill in new Address Line', function () {
                page.waitForSelector('div[aria-label="edit-ship-address-modal"]');
                page.waitForTimeout(500);

                check(page, {
                    'AddShipAddress[9/16]: Tenant list: Ship From Address: Modal (! Warehouse Details !) - is visible and content match after clicking Edit Address button': page.locator('div[aria-label="edit-ship-address-modal"]').isVisible() && page.locator('div.modal-title').textContent() == editAddressModalTitle,
                    'AddShipAddress[10/16]: Tenant list: Ship From Address: Modal (! Warehouse Details !) - Inputs are editable': page.locator('input[name="address_line1"]').isEditable() && page.locator('input[name="city"]').isEditable(),
                    'AddShipAddress[11/16]: Tenant list: Ship From Address: Modal (! Warehouse Details !) - Button (Save) is visible and enabled': page.locator('button[name="save-warehouse-address"]').isVisible() && page.locator('button[name="save-warehouse-address"]').isEnabled(),
                    'AddShipAddress[12/16]: Tenant list: Ship From Address: Modal (! Warehouse Details !) - Button (Delete) is visible and enabled': page.locator('button[name="delete-ship-from-address"]').isVisible() && page.locator('button[name="delete-ship-from-address"]').isEnabled(),
                });

                page.locator('input[name="address_line1"]').fill(addressLineEdited1);
        
                return Promise.all([
                    page.locator('button[name="save-warehouse-address"]').click(),
                ]);
            });
        })
        .then(() => {
            group('AddShipAddress: Check address changing and click Edit Adress button', function () {
                page.waitForSelector('div[aria-label="ship-from-address-table"]');
                page.waitForTimeout(1000);

                check(page, {
                    'AddShipAddress[13/16]: Tenant list: Ship From Address: Address has been edited': page.locator('td[about="address-name"] >> nth=-1').textContent() == addressLineEdited1,
                });

                return Promise.all([
                    page.locator('button[name="edit-address"] >> nth=-1').click(),
                ]);
            });
        })
        .then(() => {
            group('AddShipAddress: Click Delete button', function () {
                page.waitForSelector('div[aria-label="edit-ship-address-modal"]');
                page.waitForTimeout(500);

                return Promise.all([
                    page.locator('button[name="delete-ship-from-address"]').click(),
                ]);
            });
        })
        .then(() => {
            group('AddShipAddress: Confirm deletion', function () {
                page.waitForSelector('div[aria-label="confirm-ship-address-deletion-modal"]');
                page.waitForTimeout(500);

                check(page, {
                    'AddShipAddress[14/16]: Tenant list: Ship From Address: Modal (Confirmation Requred) is visible and content match after clicking Delete Address button': page.locator('div[aria-label="confirm-ship-address-deletion-modal"]').isVisible() && page.locator('div.modal-title').textContent() == confirmShipAddressDeletionModalTitle,
                    'AddShipAddress[15/16]: Tenant list: Ship From Address: Modal (Confirmation Requred) Button (Save and Delete) is visible and enabled': page.locator('button[name="cancel"]').isVisible() && page.locator('button[name="cancel"]').isEnabled() && page.locator('button[name="delete"]').isVisible() && page.locator('button[name="delete"]').isEnabled(),
                });

                return Promise.all([
                    page.locator('button[name="delete"]').click(),
                ]);
            });
        })
        .then(() => {
            group('AddShipAddress: Verify the deletion', function () {
                page.waitForSelector('div[aria-label="ship-from-address-table"]');

                check(page, {
                    'AddShipAddress[16/16]: Tenant list: Ship From Address: Address has been deleted': page.locator('td[about="address-name"] >> nth=-1').textContent() != addressLineEdited1,
                });
            });
        })
        .finally(() => {
            page.close();
            browser.close();
        });
}