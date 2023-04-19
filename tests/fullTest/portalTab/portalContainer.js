import { check, group } from 'k6';
import { chromium } from 'k6/x/browser';

export function PortalContainer() {
    const url = 'https://test123.portal.dev.skudrop.com/login';

    const email = 'admin@example.com';
    const password = 'admin';

    let firstDate = new Date();
    let secondDate = new Date();
    secondDate.setMonth(secondDate.getMonth() + 2);
    let yyyy = firstDate.getFullYear();
    let mmFirst = firstDate.getMonth() + 1;
    let mmSecond = secondDate.getMonth() + 1;
    let dd = firstDate.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mmFirst < 10) mmFirst = '0' + mmFirst;
    if (mmSecond < 10) mmSecond = '0' + mmSecond;

    const pol = "K6Pol";
    const pod = "K6Pod";
    const carrier = "K6Carrier";
    const containerNo = "K6_12345";
    const mawbNo = "K6_54321";
    const etd = yyyy + '-' + mmFirst + '-' + dd;
    const eta = yyyy + '-' + mmSecond + '-' + dd;
    const shipper = "K6_Shipper";
    const shipperAddress = "K6_Shipper_Address";
    const importer = "K6_Importer";
    const importerAddress = "K6_Importer_Address";
    const consignee = "K6_Consignee";
    const consigneeAddress = "K6_Consignee_Address";

    const packingListTabContainerListTableTitle = "CONTAINER LIST";

    const containerDetailsModalTitle = "Container Number: " + containerNo;
    const editContainerModalTitle = "Edit container";
    const noContainersNotificationText = "There are no containers.";
    const noAvailableContainersText = "You don`t have available containers";

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
            group('PortalContainer: Visit login page and authorization', function () {
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
            group('PortalContainer: Waiting for Shipping Dashboard page and click Create Container button', function () {
                page.waitForSelector('form[aria-label="container-form"]');

                check(page, {
                    'PortalContainer[1/24]: Shipping Dashboard: Packing List: Content is visible and matched after login': page.locator('form[aria-label="container-form"]').isVisible() && page.locator('form[aria-label="container-form"] > h5').textContent() == packingListTabContainerListTableTitle,
                    'PortalContainer[2/24]: Shipping Dashboard: Packing List: Button (Add container) is visible and enabled': page.locator('button[name="add-container"]').isVisible() && page.locator('button[name="add-container"]').isEnabled(),
                });

                page.locator('button[name="add-container"]').click();
                page.waitForTimeout(500);
                page.waitForSelector('a[about="40GP"]');

                return Promise.all([
                    page.locator('a[about="40GP"]').click(),
                ]);
            });
        })
        .then(() => {
            group('PortalContainer: Fill in container data and click Save Container button', function () {
                page.waitForSelector('div[aria-label="container-list-table"]');

                check(page, {
                    'PortalContainer[3/24]: Shipping Dashboard: Packing List: Input (POL and MAWB NO) is editable': page.locator('input[name="pol"]').isEditable() && page.locator('input[name="mawb_number"]').isEditable(),
                    'PortalContainer[4/24]: Shipping Dashboard: Packing List: Input (ETD) is editable': page.locator('input[name="etd"]').isEditable() && page.locator('input[name="eta"]').isEditable(),
                    'PortalContainer[5/24]: Shipping Dashboard: Packing List: Input (Shipper and Importer) is editable': page.locator('input[name="shipper"]').isEditable() && page.locator('input[name="importer"]').isEditable(),
                    'PortalContainer[6/24]: Shipping Dashboard: Packing List: Button (Save Container) is visible and enabled': page.locator('button[name="save-container"]').isVisible() && page.locator('button[name="save-container"]').isEnabled(),
                });

                page.locator('input[name="pol"]').fill(pol);
                page.locator('input[name="pod"]').fill(pod);
                page.locator('input[name="carrier"]').fill(carrier);
                page.locator('input[name="container_number"]').fill(containerNo);
                page.locator('input[name="etd"]').fill(etd);
                page.locator('input[name="eta"]').fill(eta);
                page.locator('input[name="mawb_number"]').fill(mawbNo);
                page.locator('input[name="shipper"]').fill(shipper);
                page.locator('input[name="shipper_address"]').fill(shipperAddress);
                page.locator('input[name="importer"]').fill(importer);
                page.locator('input[name="importer_address"]').fill(importerAddress);
                page.locator('input[name="consignee"]').fill(consignee);
                page.locator('input[name="consignee_address"]').fill(consigneeAddress);

                return Promise.all([
                    page.locator('button[name="save-container"]').click(),
                ]);
            });
        })
        .then(() => {
            group('PortalContainer: Check container saving and click Lock Container button', function () {
                page.waitForSelector('div[aria-label="container-list-table"]');

                check(page, {
                    'PortalContainer[7/24]: Shipping Dashboard: Packing List: Container is created': page.locator('tbody[aria-label="add-container-table-body"]').isVisible() && page.locator('td[about="pol"]').textContent() == pol,
                    'PortalContainer[8/24]: Shipping Dashboard: Packing List: Button (Lock Container) is visible and enabled': page.locator('input[name="lock-container"]').isVisible() && page.locator('input[name="lock-container"]').isEnabled(),
                    'PortalContainer[9/24]: Shipping Dashboard: Packing List: Button (Edit Container) is visible and enabled': page.locator('svg[name="edit-portal-container"]').isVisible() && page.locator('svg[name="edit-portal-container"]').isEnabled(),
                    'PortalContainer[10/24]: Shipping Dashboard: Packing List: Button (Assign To Container) is visible and disabled': page.locator('button[name="assign-to-container"]').isVisible() && page.locator('button[name="assign-to-container"]').isDisabled(),
                    'PortalContainer[11/24]: Shipping Dashboard: Packing List: Input (Select product) is visible and editable': page.locator('input[name="select-product"]').isVisible() && page.locator('input[name="select-product"]').isEditable(),
                });

                return Promise.all([
                    page.locator('input[name="lock-container"]').click(),
                ]);
            });
        })
        .then(() => {
            group('PortalContainer: Check Container Locking and select product', function () {
                page.waitForSelector('div[aria-label="container-list-table"]');
                page.waitForTimeout(500);

                check(page, {
                    'PortalContainer[12/24]: Shipping Dashboard: Packing List: Button (Lock Container) is checked': page.locator('input[name="lock-container"]').isChecked(),
                });

                return Promise.all([
                    page.locator('input[name="select-product"]').click(),
                ]);
            });
        })
        .then(() => {
            group('PortalContainer: Check the lack of possibility to add products and go to Invoice tab', function () {
                page.waitForSelector('div[aria-label="container-list-table"]');

                page.locator('button[name="assign-to-container"]').click();
                page.waitForSelector('div[aria-label="no-available-containers"]');

                check(page, {
                    'PortalContainer[13/24]: Shipping Dashboard: Invoice: Button (Assign To Container) have not available containers after checking product checkbox': page.locator('div[aria-label="no-available-containers"]').isVisible() && page.locator('div[aria-label="no-available-containers"]').textContent() == noAvailableContainersText,
                });

                page.locator('button[name="assign-to-container"]').click();
                page.locator('input[name="select-product"]').click();

                return Promise.all([
                    page.waitForNavigation(),
                    page.locator('button[id="Dashboard-tab-Invoice"]').click(),
                ]);
            });
        })
        .then(() => {
            group('PortalContainer: Check the lack of possibility to add products and go back to Packing List tab', function () {
                page.waitForSelector('tbody[aria-label="invoice-data"]');

                check(page, {
                    'PortalContainer[14/24]: Shipping Dashboard: Packing List: Container is in the invoice tab and POL match': page.locator('tbody[aria-label="invoice-data"]').isVisible() && page.locator('td[about="invoice-pol"]').textContent() == pol,
                });

                return Promise.all([
                    page.waitForNavigation(),
                    page.locator('button[id="Dashboard-tab-PackingList"]').click(),
                ]);
            });
        })
        .then(() => {
            group('PortalContainer: Unlock container', function () {
                page.waitForSelector('div[aria-label="container-list-table"]');

                return Promise.all([
                    page.locator('input[name="lock-container"]').click(),
                ]);
            });
        })
        .then(() => {
            group('PortalContainer: Add product to container', function () {
                page.waitForSelector('div[aria-label="container-list-table"]');
                page.waitForTimeout(500);

                page.locator('input[name="select-product"]').click();
                page.locator('button[name="assign-to-container"]').click();
                page.waitForSelector('a[about="container-name"]');

                return Promise.all([
                    page.locator('a[about="container-name"]').click(),
                ]);
            });
        })
        .then(() => {
            group('PortalContainer: Check Product List table and click Container Details button', function () {
                page.waitForSelector('div[aria-label="no-products-notification"]');

                check(page, {
                    'PortalContainer[15/24]: Shipping Dashboard: Packing List: Product disappeared from the Product List': page.locator('div[aria-label="no-products-notification"]').isVisible() && page.locator('button[name="show-more-details"]').isVisible(),
                });

                return Promise.all([
                    page.locator('button[name="show-more-details"]').click(),
                ]);
            });
        })
        .then(() => {
            group('PortalContainer: Check Container Details modal and click Remove Order From Container button', function () {
                page.waitForSelector('div[aria-label="details-container-modal"]');

                check(page, {
                    'PortalContainer[16/24]: Shipping Dashboard: Packing List: Modal (Container Details) - Modal is visible and content match': page.locator('div[aria-label="details-container-modal"]').isVisible() && page.locator('div.modal-header').textContent() == containerDetailsModalTitle,
                    'PortalContainer[17/24]: Shipping Dashboard: Packing List: Modal (Container Details) - Button (Remove Order) is visible and enabled': page.locator('svg[name="remove-order-from-container"]').isVisible() && page.locator('svg[name="remove-order-from-container"]').isEnabled(),
                });

                return Promise.all([
                    page.locator('svg[name="remove-order-from-container"]').click(),
                ]);
            });
        })
        .then(() => {
            group('PortalContainer: Check returning the product to the product list and click Edit Container button', function () {
                page.waitForSelector('tbody[aria-label="product-list-table-body"]');

                check(page, {
                    'PortalContainer[18/24]: Shipping Dashboard: Packing List: Product is returned to the product list': page.locator('input[name="select-product"]').isVisible(),
                });

                return Promise.all([
                    page.locator('svg[name="edit-portal-container"]').click(),
                ]);
            });
        })
        .then(() => {
            group('PortalContainer: Check Edit Container modal and click Delete Container button', function () {
                page.waitForSelector('div[aria-label="edit-container-modal"]');

                check(page, {
                    'PortalContainer[19/24]: Shipping Dashboard: Packing List: Modal (Edit Container) - Modal is visible and content match': page.locator('div[aria-label="edit-container-modal"]').isVisible() && page.locator('div.modal-title').textContent() == editContainerModalTitle,
                    'PortalContainer[20/24]: Shipping Dashboard: Packing List: Modal (Edit Container) - Shipper is valid': page.locator('input[name="shipper"]').inputValue() == shipper,
                    'PortalContainer[21/24]: Shipping Dashboard: Packing List: Modal (Edit Container) - Inputs (POL, ETD, SHIPPER) are editable': page.locator('input[name="pol"]').isEditable() && page.locator('input[name="etd"]').isEditable() && page.locator('input[name="shipper"]').isEditable(),
                    'PortalContainer[22/24]: Shipping Dashboard: Packing List: Modal (Edit Container) - Button (Save) is visible and enabled': page.locator('button[name="save-container"]').isVisible() && page.locator('button[name="save-container"]').isEnabled(),
                    'PortalContainer[23/24]: Shipping Dashboard: Packing List: Modal (Edit Container) - Button (Delete Container) is visible and enabled': page.locator('button[name="delete-container"]').isVisible() && page.locator('button[name="delete-container"]').isEnabled(),
                });

                return Promise.all([
                    page.locator('button[name="delete-container"]').click(),
                ]);
            });
        })
        .then(() => {
            group('PortalContainer: Wait for delete confirmation button and click it', function () {
                page.waitForSelector('button[name="confirm-container-deletion"]');

                check(page, {
                    'PortalContainer[24/24]: Shipping Dashboard: Packing List: Modal (Edit Container) - Button (Confirm Deletion) is visible and enabled': page.locator('button[name="confirm-container-deletion"]').isVisible() && page.locator('button[name="confirm-container-deletion"]').isEnabled(),
                });

                // return Promise.all([
                //     page.waitForNavigation(),
                //     page.locator('button[name="confirm-container-deletion"]').click(),
                // ]);
                return Promise.all([
                    page.locator('button[name="save-container"]').click(),
                ]);
            });
        })
        // .then(() => {
        //     group('PortalContainer: Check container deletion', function () {
        //         page.waitForSelector('div[aria-label="no-containers-notification"]');

        //         check(page, {
        //             'PortalContainer[25/24]: Shipping Dashboard: Packing List: Container is deleted': page.locator('div[aria-label="no-containers-notification"]').isVisible() && page.locator('div[aria-label="no-containers-notification"] > h4').textContent() == noContainersNotificationText,
        //         });
        //     });
        // })
        .finally(() => {
            page.close();
            browser.close();
        });
}