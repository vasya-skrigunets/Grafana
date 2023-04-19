import { check, group } from 'k6';
import { chromium } from 'k6/x/browser';

export function ChargingRates() {
    const url = 'https://dev.dev.skudrop.com/login';

    const email = 'admin@example.com';
    const password = 'admin';

    const prepRateUSD = "2.77";
    const SKUdropMargin = "15.14";
    const truckWeight30_40kg = "10.12";
    const truckCBM150_200cm = "301.02";
    const cartonRate22_40kg  = "161.21";
    const minimumCartonWeight = "12.15";
    const shippingRatesUSWEST_100kg_MediumBoat = "11.36";
    const shippingRatesUSMID12_99kg_FastBoat = "20.18";

    const totalUnitsStoredTitle = "Total Units Stored";
    const chargingRatesPageTitle = "Rates";

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
            group('ChargingRates: Visit login page and authorization', function () {
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
            group('ChargingRates: Waiting for Warehouse Dashboard page and go to Charging Rates page', function () {
                page.waitForSelector('div[aria-label="total-units-stored"] > h1 >> nth=0');

                check(page, {
                    'ChargingRates[1/11]: Warehouse Dashboard: Page is visible and content match': page.locator('div[aria-label="total-units-stored"] > p >> nth=0').isVisible() && page.locator('div[aria-label="total-units-stored"] > p >> nth=0').textContent() == totalUnitsStoredTitle,
                });

                return Promise.all([
                    page.waitForNavigation(),
                    page.locator('a[href="/dashboard-warehouse/charging-rates/"]').click(),
                ]);
            });
        })
        .then(() => {
            group('ChargingRates: Wait for Charging Rates page and fill in new rates', function () {
                page.waitForSelector('form[aria-label="charging-rates-form"]');
                page.waitForTimeout(1000);

                check(page, {
                    'ChargingRates[2/11]: Charging Rates: Page is visible and content match': page.locator('form[aria-label="charging-rates-form"]').isVisible() && page.locator('div[aria-label="skudrop-rates-table"] > h5').textContent() == chargingRatesPageTitle,
                    'ChargingRates[3/11]: Charging Rates: Inputs (Prep rate (USD) and SKUdrop Margin) are editable': page.locator('input[name="prep_rate"]').isEditable() && page.locator('input[name="skudrop_margin"]').isEditable(),
                    'ChargingRates[4/11]: Charging Rates: Inputs (Truck weight 30kg - 40kg and Truck CBM 150cm-200cm) are editable': page.locator('input[name="truck_weight_gte_30"]').isEditable() && page.locator('input[name="truck_cbm_longest_size_150_200"]').isEditable(),
                    'ChargingRates[5/11]: Charging Rates: Inputs (22kg - 40kg carton rate and Minimum carton weight) are editable': page.locator('input[name="carton_range_22_40_kg"]').isEditable() && page.locator('input[name="min_kg_value"]').isEditable(),
                    'ChargingRates[6/11]: Charging Rates: Button (Upload Rates file) is visible and enabled': page.locator('button[name="upload-rates-file"]').isVisible() && page.locator('button[name="upload-rates-file"]').isEnabled(),
                    'ChargingRates[7/11]: Charging Rates: Button (Save Charges) is visible and enabled': page.locator('button[name="save-charges"]').isVisible() && page.locator('button[name="save-charges"]').isEnabled(),
                });

                page.locator('input[name="prep_rate"]').fill('');
                page.locator('input[name="prep_rate"]').fill(prepRateUSD);
                page.locator('input[name="skudrop_margin"]').fill('');
                page.locator('input[name="skudrop_margin"]').fill(SKUdropMargin);
                page.locator('input[name="truck_weight_gte_30"]').fill('');
                page.locator('input[name="truck_weight_gte_30"]').fill(truckWeight30_40kg);
                page.locator('input[name="truck_cbm_longest_size_150_200"]').fill('');
                page.locator('input[name="truck_cbm_longest_size_150_200"]').fill(truckCBM150_200cm);
                page.locator('input[name="carton_range_22_40_kg"]').fill('');
                page.locator('input[name="carton_range_22_40_kg"]').fill(cartonRate22_40kg);
                page.locator('input[name="min_kg_value"]').fill('');
                page.locator('input[name="min_kg_value"]').fill(minimumCartonWeight);
                page.locator('input[name="meidum_boat_gt_100_kg_west"]').fill('');
                page.locator('input[name="meidum_boat_gt_100_kg_west"]').fill(shippingRatesUSWEST_100kg_MediumBoat);
                page.locator('input[name="fast_boat_12_99_kg_mid"]').fill('');
                page.locator('input[name="fast_boat_12_99_kg_mid"]').fill(shippingRatesUSMID12_99kg_FastBoat);

                return Promise.all([
                    page.locator('button[name="save-charges"]').click(),
                ]);
            });
        })
        .then(() => {
            group('ChargingRates: Check the absence of the container and products in CLX Express tab and go to Tax Rule page', function () {
                page.waitForSelector('form[aria-label="charging-rates-form"]');

                page.waitForTimeout(1000);

                check(page, {
                    'ChargingRates[8/11]: Charging Rates: Inputs (Prep rate (USD) and SKUdrop Margin) are changed': page.locator('input[name="prep_rate"]').inputValue() == prepRateUSD && page.locator('input[name="skudrop_margin"]').inputValue() == SKUdropMargin,
                    'ChargingRates[9/11]: Charging Rates: Inputs (Truck weight 30kg - 40kg and Truck CBM 150cm-200cm) are changed': page.locator('input[name="truck_weight_gte_30"]').inputValue() == truckWeight30_40kg && page.locator('input[name="truck_cbm_longest_size_150_200"]').inputValue() == truckCBM150_200cm,
                    'ChargingRates[10/11]: Charging Rates: Inputs (22kg - 40kg carton rate and Minimum carton weight) are changed': page.locator('input[name="carton_range_22_40_kg"]').inputValue() == cartonRate22_40kg && page.locator('input[name="min_kg_value"]').inputValue() == minimumCartonWeight,
                    'ChargingRates[11/11]: Charging Rates: Inputs (US WEST + 100KG Medium boat and US MID 12KG - 99KG Fast Boat) are changed': page.locator('input[name="meidum_boat_gt_100_kg_west"]').inputValue() == shippingRatesUSWEST_100kg_MediumBoat && page.locator('input[name="fast_boat_12_99_kg_mid"]').inputValue() == shippingRatesUSMID12_99kg_FastBoat,
                });
            });
        })
        .finally(() => {
            page.close();
            browser.close();
        });
}