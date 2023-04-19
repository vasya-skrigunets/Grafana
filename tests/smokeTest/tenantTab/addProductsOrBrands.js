import { check, group } from 'k6';
import { chromium } from 'k6/x/browser';

export function AddProductsOrBrands() {
    const url = 'https://test.dev.skudrop.com/login';

    const email = 'admin@example.com';
    const password = 'admin';

    const productName = "K6 Test Name";
    const HSCode = "1234.56";
    const productWidth = "50";
    const productHeight = "50";
    const productLength = "50";
    const cartonWeight = "21";
    const unitsPerCarton = "20";

    const addProductsOrBrandsPageTitle = "Select products from Seller Central to add to SKUdrop";
    const shippingDeclarationModalTitle = "SHIPPING DECLARATION";
    

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
            group('AddProductsOrBrands: Visit login page and authorization', function () {
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
            group('AddProductsOrBrands: Waiting for Dashboard page and redirecting to Add Products Or Brands page', function () {
                page.waitForSelector('div[aria-label="total-units-stored"] > h1 >> nth=0');
    
                return Promise.all([
                    page.waitForNavigation(),
                    page.locator('a[href="/dashboard/import-or-manually"]').click(),
                ]);
            });
        })
        .then(() => {
            group('AddProductsOrBrands: Waiting for Add Products Or Brands page and filling in product data', function () {
                page.waitForSelector('div[aria-label="add-product-to-skudrop"]');
                page.waitForTimeout(500);

                check(page, {
                    'AddProductsOrBrands[1/8]: Add Products Or Brands: Page is visible and content match after redirection to page': page.locator('div[aria-label="add-product-to-skudrop"]').isVisible() && page.locator('div[aria-label="add-product-to-skudrop"] > div > div > label >> nth=0').textContent() == addProductsOrBrandsPageTitle,
                    'AddProductsOrBrands[2/8]: Add Products Or Brands: Inputs are editable': page.locator('input[name="name_c4fb8d68-184e-469b-a4e0-497a5be9297a"]').isEditable() && page.locator('input[name="hs.hs_code_c4fb8d68-184e-469b-a4e0-497a5be9297a_0"]').isEditable(),
                    'AddProductsOrBrands[3/8]: Add Products Or Brands: Button (Add Selected Product To Skudrop) is visible and enabled': page.locator('button[name="add-selected-product-to-skudrop"]').isVisible() && page.locator('button[name="add-selected-product-to-skudrop"]').isEnabled(),
                });

                page.locator('input[name="name_c4fb8d68-184e-469b-a4e0-497a5be9297a"]').fill(productName);
                page.locator('input[name="hs.hs_code_c4fb8d68-184e-469b-a4e0-497a5be9297a_0"]').fill(HSCode);
                page.locator('input[name="width_c4fb8d68-184e-469b-a4e0-497a5be9297a"]').fill(productWidth);
                page.locator('input[name="height_c4fb8d68-184e-469b-a4e0-497a5be9297a"]').fill(productHeight);
                page.locator('input[name="length_c4fb8d68-184e-469b-a4e0-497a5be9297a"]').fill(productLength);
                page.locator('input[name="weight_c4fb8d68-184e-469b-a4e0-497a5be9297a"]').fill(cartonWeight);
                page.locator('input[name="units_per_carton_c4fb8d68-184e-469b-a4e0-497a5be9297a"]').fill(unitsPerCarton);

                page.locator('input[type="checkbox"] >> nth=-1').check();

                page.waitForTimeout(1000);

                check(page, {
                    'AddProductsOrBrands[4/8]: Add Products Or Brands: Select checkbox is checked': page.locator('input[type="checkbox"] >> nth=-1').isChecked(),
                });

                return Promise.all([
                    page.locator('button[name="add-selected-product-to-skudrop"]').click(),
                ]);
            });
        })
        .then(() => {
            group('AddProductsOrBrands: Сlick the Add Selected Product To Skudrop button and importing product to skudrop', function () {
                page.waitForSelector('div[aria-label="shipping-declaration-modal"]');

                check(page, {
                    'AddProductsOrBrands[5/8]: Add Products Or Brands: Modal (Shipping Declaration) is visible and content match after clicking Add Selected Product To Skudrop button': page.locator('div[aria-label="shipping-declaration-modal"]').isVisible() && page.locator('div[aria-label="shipping-declaration-modal-title"]').textContent() == shippingDeclarationModalTitle,
                    'AddProductsOrBrands[6/8]: Add Products Or Brands: Modal (Shipping Declaration) Button (Remove) is visible and enabled': page.locator('button[name="remove-product"]').isVisible() && page.locator('button[name="remove-product"]').isEnabled(),
                    'AddProductsOrBrands[7/8]: Add Products Or Brands: Modal (Shipping Declaration) Button (Import Products To Skudrop) is visible and enabled': page.locator('button[name="import-products-to-skudrop"]').isVisible() && page.locator('button[name="import-products-to-skudrop"]').isEnabled(),
                });

                return Promise.all([
                    page.waitForNavigation(),
                    page.locator('button[name="import-products-to-skudrop"]').click(),
                ]);
            });
        })
        .then(() => {
            group('AddProductsOrBrands: Check product addition on Dashboard page', function () {
                page.waitForSelector('div[aria-label="uploaded-product-name_K6 Test Name"] >> nth=0');
                page.waitForTimeout(500);

                check(page, {
                    'AddProductsOrBrands[8/8]: Dashboard: Product has been added to uploaded products after importing product to skudrop': page.locator(`div[aria-label="uploaded-product-name_${productName}"] >> nth=0`).textContent() == productName,
                });
            });
        })
        .finally(() => {
            page.close();
            browser.close();
        });
}