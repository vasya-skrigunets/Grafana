import { check, group } from 'k6';
import { chromium } from 'k6/x/browser';

export function AddNewWarehouse() {
    const url = 'https://dev.dev.skudrop.com/login';

    const email = 'admin@example.com';
    const password = 'admin';

    let cubicMetersAvailableBefore, cubicMetersAvailableAfter = 0;

    const warehouseCustomId = "K6Test";
    const subdomain = "k6test";
    const addressLine1 = "K6Address1";
    const addressLineZh1 = "K6Address1_zh";
    const addressLine2 = "K6Address2";
    const addressLineZh2 = "K6Address2_zh";
    const city = "K6City";
    const cityZh = "K6City_zh";
    const stateOrProvinceCode = "K6Province";
    const stateOrProvinceCodeZh = "K6Province_zh";
    const postalCode = "123";
    const postalCodeZh = "321";
    const countryCodeDropdownOption_US = "US";
    const companyName = "K6Person";
    const companyNameEdited = "K6PersonEdited";
    const phoneNumber = "666666666";
    const storageCubicMeters = "1000.00";
    const storageCubicMetersEdited = "900.00";
    
    const incomingCartonsTableTitle = "Incoming cartons";
    const addNewWarehouseAlertTitle = "Warehouse creation procedure started.";
    const addNewWarehousePageTitle = "Warehouse set up";
    const tenantListPageWarehouseTableTitle = "Warehouse List";
    const warehouseDetailsModalTitle = "Warehouse Details";

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
            group('AddNewWarehouse: Visit login page and authorization', function () {
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
            group('AddNewWarehouse: Waiting for Warehouse Dashboard page and redirecting to Add New Warehouse page', function () {
                page.waitForSelector('div[aria-label="total-units-stored"] > h1 >> nth=0');

                check(page, {
                    'AddNewWarehouse[1/19]: Warehouse Dasboard: Content is visible and matched after login': page.locator('img[alt="LOGO"]').isVisible() && page.locator('h5[aria-label="incoming-cartons-table-title"]').textContent() == incomingCartonsTableTitle,
                });

                return Promise.all([
                    page.waitForNavigation(),
                    page.locator('a[href="/dashboard-warehouse/set-up/"]').click(),
                ]);
            });
        })
        .then(() => {
            group('AddNewWarehouse: Check Add New Warehouse page and fill in all inputs', function () {
                page.waitForSelector('label[aria-label="warehouse-set-up-page-title"]');

                check(page, {
                    'AddNewWarehouse[2/19]: Add New Warehouse: Page is visible and content matched when the tab button is clicked': page.locator('label[aria-label="warehouse-set-up-page-title"]').isVisible() && page.locator('label[aria-label="warehouse-set-up-page-title"]').textContent() == addNewWarehousePageTitle,
                    'AddNewWarehouse[3/19]: Add New Warehouse: Input (Warehouse ID) is visible and editable': page.locator('input[name="warehouse_custom_id"]').isVisible() && page.locator('input[name="warehouse_custom_id"]').isEditable(),
                    'AddNewWarehouse[4/19]: Add New Warehouse: Input (SKUdrop Username) is visible and editable': page.locator('input[name="subdomain"]').isVisible() && page.locator('input[name="subdomain"]').isEditable(),
                    'AddNewWarehouse[5/19]: Add New Warehouse: Button (SAVE WAREHOUSE DETAILS) is visible and enabled': page.locator('button[type="submit"]').isVisible() && page.locator('button[type="submit"]').isEnabled(),
                });

                page.locator('input[name="warehouse_custom_id"]').fill(warehouseCustomId);
                page.locator('input[name="subdomain"]').fill(subdomain);
                page.locator('input[name="address_line1"]').fill(addressLine1);
                page.locator('input[name="address_line1_zh"]').fill(addressLineZh1);
                page.locator('input[name="address_line2"]').fill(addressLine2);
                page.locator('input[name="address_line2_zh"]').fill(addressLineZh2);
                page.locator('input[name="city"]').fill(city);
                page.locator('input[name="city_zh"]').fill(cityZh);
                page.locator('input[name="state_or_province_code"]').fill(stateOrProvinceCode);
                page.locator('input[name="state_or_province_code_zh"]').fill(stateOrProvinceCodeZh);
                page.locator('input[name="postal_code"]').fill(postalCode);
                page.locator('input[name="postal_code_zh"]').fill(postalCodeZh);
                page.locator('select[name="country_code"]').selectOption(countryCodeDropdownOption_US);
                page.locator('input[name="company_name"]').fill(companyName);
                page.locator('input[name="phone_number"]').fill(phoneNumber);
                page.locator('input[name="storage_cubic_meters"]').fill(storageCubicMeters);

                return Promise.all([
                    page.locator('button[name="save-warehouse-details"]').click(),
                ]);
            });
        })
        .then(() => {
            group('AddNewWarehouse: Wait for the warehouse creation notification and redirection to Tenant List page', function () {
                page.waitForSelector('div[role="alert"]', {timeout: 20000});

                check(page, {
                    'AddNewWarehouse[6/19]: Add New Warehouse: Alert is visible and alert content mached when button (Save Warehouse Details) is clicked': page.locator('div[role="alert"]').isVisible() && page.locator('div[role="alert"]').textContent() == addNewWarehouseAlertTitle,
                });
                
                page.waitForSelector('a[href="/dashboard-warehouse/tenant-list/"]');
                
                return Promise.all([
                    page.waitForNavigation(),
                    page.locator('a[href="/dashboard-warehouse/tenant-list/"]').click(),
                ]);
            });
        })
        .then(() => {
            group('AddNewWarehouse: Check Tenant List page and click Edit Warehouse button', function () {
                page.waitForSelector('div[aria-label="tenant-list-page"]');
                page.waitForTimeout(1000);

                cubicMetersAvailableBefore = parseFloat(page.locator('div[aria-label="cubic-meters-available"] > div > h5').textContent());

                check(page, {
                    'AddNewWarehouse[7/19]: Tenant List: Page is visible and content matched': page.locator('div[aria-label="warehouse-list-table"] > h5').isVisible() && page.locator('div[aria-label="warehouse-list-table"] > h5').textContent() == tenantListPageWarehouseTableTitle,
                    'AddNewWarehouse[8/19]: Tenant List: Table Warehouse List - Button (Visit) is visible and enabled': page.locator('button[name="visit-warehouse-dashboard"] >> nth=-1').isVisible() && page.locator('button[name="visit-warehouse-dashboard"] >> nth=-1').isEnabled(),
                    'AddNewWarehouse[9/19]: Tenant List: Table Warehouse List - Button (Edit) is visible and enabled': page.locator('button[name="edit-warehouse"] >> nth=-1').isVisible() && page.locator('button[name="edit-warehouse"] >> nth=-1').isEnabled(),
                });

                return Promise.all([
                    page.locator('button[name="edit-warehouse"] >> nth=-1').click(),
                ]);
            });
        })
        .then(() => {
            group('AddNewWarehouse: Check Warehouse Details modal, editing warehouse and click Save Warehouse Details button', function () {
                page.waitForSelector('div[aria-label="warehouse-details-modal"]');

                check(page, {
                    'AddNewWarehouse[10/19]: Tenant List: Modal (Warehouse Details) - Modal is visible and content matched': page.locator('div[aria-label="warehouse-details-modal"]').isVisible() && page.locator('div.modal-title').textContent() == warehouseDetailsModalTitle,
                    'AddNewWarehouse[11/19]: Tenant List: Modal (Warehouse Details) - Input (Contact person and Warehouse space) has valid data and editable': page.locator('input[name="company_name"]').isEditable() && page.locator('input[name="company_name"]').inputValue() == companyName && page.locator('input[name="static_value_of_storage_cubic_meters"]').isEditable() && page.locator('input[name="static_value_of_storage_cubic_meters"]').inputValue() == storageCubicMeters,
                    'AddNewWarehouse[12/19]: Tenant List: Modal (Warehouse Details) - Button (Save Warehouse Details) is visible and editable': page.locator('button[name="save-warehouse-details"]').isVisible() && page.locator('button[name="save-warehouse-details"]').isEnabled(),
                    'AddNewWarehouse[13/19]: Tenant List: Modal (Warehouse Details) - Button (Delete Warehouse) is visible and editable': page.locator('button[name="delete-warehouse"]').isVisible() && page.locator('button[name="delete-warehouse"]').isEnabled(),
                    'AddNewWarehouse[14/19]: Tenant List: Modal (Warehouse Details) - Checkbox (Disable warehouse) is visible and editable': page.locator('input[type="checkbox"]').isVisible() && page.locator('input[type="checkbox"]').isEnabled(),
                });

                page.locator('input[name="company_name"]').fill(companyNameEdited);
                page.locator('input[name="static_value_of_storage_cubic_meters"]').fill(storageCubicMetersEdited);
                page.locator('input[type="checkbox"]').check();

                return Promise.all([
                    page.locator('button[name="save-warehouse-details"]').click(),
                ]);
            });
        })
        .then(() => {
            group('AddNewWarehouse: Check the change available cubic meter and deleting warehouse', function () {
                page.waitForSelector('div[aria-label="cubic-meters-available"] > div > h5');
                page.waitForTimeout(500);

                cubicMetersAvailableAfter = parseFloat(page.locator('div[aria-label="cubic-meters-available"] > div > h5').textContent());

                check(page, {
                    'AddNewWarehouse[15/19]: Tenant List: Cubic meters available value became smaller after changing and saving edited warehouse data': cubicMetersAvailableBefore > cubicMetersAvailableAfter,
                })

                return Promise.all([
                    page.waitForSelector('button[name="edit-warehouse"] >> nth=-1'),
                    page.locator('button[name="edit-warehouse"] >> nth=-1').click(),
                ]);
            });
        })
        .then(() => {
            group('AddNewWarehouse: Check Warehouse Details modal and click Delete Warehouse button', function () {
                page.waitForSelector('div[aria-label="warehouse-details-modal"]');

                check(page, {
                    'AddNewWarehouse[16/19]: Tenant List: Modal (Warehouse Details) - Input (Contact person) has valid data after changing and saving': page.locator('input[name="company_name"]').inputValue() == companyNameEdited,
                    'AddNewWarehouse[17/19]: Tenant List: Modal (Warehouse Details) - Checkbox (Disable warehouse) is checked after saving': page.locator('input[type="checkbox"]').isChecked(),
                });

                return Promise.all([
                    page.locator('button[name="delete-warehouse"]').click(),
                ]);
            });
        })
        .then(() => {
            group('AddNewWarehouse: Check Confirmation Required modal and click Delete button', function () {
                page.waitForSelector('div[aria-label="confirmation-warehouse-deletion"]');

                check(page, {
                    'AddNewWarehouse[18/19]: Tenant List: Modal (Confirmation Required) - Window is visible': page.locator('div[aria-label="confirmation-warehouse-deletion"]').isVisible(),
                    'AddNewWarehouse[19/19]: Tenant List: Modal (Confirmation Required) - Buttons (Cancel and Delete) is visible and enabled': page.locator('button[name="cancel"]').isVisible() && page.locator('button[name="cancel"]').isEnabled() && page.locator('button[name="delete"]').isVisible() && page.locator('button[name="delete"]').isEnabled(),
                });

                return Promise.all([
                    page.locator('button[name="delete"]').click(),
                ]);
            });
        })
        .then(() => {
            group('AddNewWarehouse: Wait for Tenant List page', function () {
                page.waitForSelector('div[aria-label="tenant-list-page"]');
            });
        })
        .finally(() => {
            page.close();
            browser.close();
        });
}