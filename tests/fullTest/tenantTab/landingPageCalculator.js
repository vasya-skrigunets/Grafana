import { check, group } from 'k6';
import { chromium } from 'k6/x/browser';

export function LandingPageCalculator() {
    const url = 'https://test.dev.skudrop.com';

    const cartonLength = "20";
    const cartonWidth = "30";
    const cartonHeight = "40";
    const cartonWeight = "15";
    const numberOfCartons = "4";
    const numberOfCartons2 = "32";

    let kgWeeklyCost = "";
    let kgFullCost = "";
    let lbWeeklyCost = "";
    let lbFullCost = "";

    const calculatorSectionTitle = "Enter your carton details below";
    const pl3TrueText = "Reduce expensive US 3PL costs";
    const pl3FalseText = "Did you know...";

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
            group('LandingPageCalculator: Visit Landing page, check calculator and fill in data', function () {
                page.waitForSelector('div[aria-label="calculator-wrapper"]');

                check(page, {
                    'LandingPageCalculator[1/16]: Landing page: Calculator content is match': page.locator('div[aria-label="calculator-wrapper"]').isVisible() && page.locator('div[aria-label="calculator-wrapper"] > h3').textContent() == calculatorSectionTitle,
                    'LandingPageCalculator[2/16]: Landing page: Input (Carton length) is editable': page.locator('input[name="length_0"]').isEditable(),
                    'LandingPageCalculator[3/16]: Landing page: Input (Carton width) is editable': page.locator('input[name="width_0"]').isEditable(),
                    'LandingPageCalculator[4/16]: Landing page: Input (Carton height) is editable': page.locator('input[name="height_0"]').isEditable(),
                    'LandingPageCalculator[5/16]: Landing page: Input (Carton weight) is editable': page.locator('input[name="weight_0"]').isEditable(),
                    'LandingPageCalculator[6/16]: Landing page: Input (Number of cartons) is editable': page.locator('input[name="number_of_cartons_0"]').isEditable(),
                    'LandingPageCalculator[7/16]: Landing page: Button (Calculate) is visible and enabled': page.locator('button[name="calculate"]').isVisible() && page.locator('button[name="calculate"]').isEnabled(),
                });

                page.locator('input[name="length_0"]').fill('');
                page.locator('input[name="length_0"]').fill(cartonLength);
                page.locator('input[name="width_0"]').fill('');
                page.locator('input[name="width_0"]').fill(cartonWidth);
                page.locator('input[name="height_0"]').fill('');
                page.locator('input[name="height_0"]').fill(cartonHeight);
                page.locator('input[name="weight_0"]').fill('');
                page.locator('input[name="weight_0"]').fill(cartonWeight);
                page.locator('input[name="number_of_cartons_0"]').fill('');
                page.locator('input[name="number_of_cartons_0"]').fill(numberOfCartons);

                return Promise.all([
                    page.locator('button[type="submit"]').click(),
                ]);
            });
        })
        .then(() => {
            group('LandingPageCalculator: Waiting for 1 calculator step', function () {
                page.waitForSelector('button[name="question-button"]');

                return Promise.all([
                    page.locator('button[name="question-button"]').click(),
                ]);
            });
        })
        .then(() => {
            group('LandingPageCalculator: Waiting for 2 calculator step', function () {
                page.waitForSelector('button[name="question-button"]');
                page.waitForTimeout(500);

                return Promise.all([
                    page.locator('button[name="question-button"] >> nth=0').click(),
                ]);
            });
        })
        .then(() => {
            group('LandingPageCalculator: Waiting for 3 calculator step', function () {
                page.waitForSelector('button[name="question-button"]');
                page.waitForTimeout(500);

                return Promise.all([
                    page.locator('button[name="question-button"] >> nth=0').click(),
                ]);
            });
        })
        .then(() => {
            group('LandingPageCalculator: Check result and enable Full Shipment option', function () {
                page.waitForSelector('h5[about="3pl-true"]');
                page.waitForTimeout(500);

                kgWeeklyCost = page.locator('h1[aria-label="calculated-price"]').textContent();

                check(page, {
                    'LandingPageCalculator[8/16]: Landing page: KG Weekly cost is displayed': kgWeeklyCost != "" && parseFloat(kgWeeklyCost) != 0,
                    'LandingPageCalculator[9/16]: Landing page: Displayed about 3PL': page.locator('h5[about="3pl-true"]').textContent() == pl3TrueText,
                });

                return Promise.all([
                    page.locator('input[type="checkbox"] >> nth=-1').click(),
                ]);
            });
        })
        .then(() => {
            group('LandingPageCalculator: Check new cost and reset calculator', function () {
                page.waitForSelector('h5[about="3pl-true"]');
                page.waitForTimeout(500);

                kgFullCost = page.locator('h1[aria-label="calculated-price"]').textContent();

                check(page, {
                    'LandingPageCalculator[10/16]: Landing page: KG Full cost is displayed': kgFullCost != "" && parseFloat(kgFullCost) != 0,
                    'LandingPageCalculator[11/16]: Landing page: KG Weekly cost and Full cost are different': parseFloat(kgFullCost) != parseFloat(kgWeeklyCost),
                });

                return Promise.all([
                    page.locator('div[aria-label="reset-calculator"] >> nth=0').click(),
                ]);
            });
        })
        .then(() => {
            group('LandingPageCalculator: Visit Landing page, check calculator and fill in data', function () {
                page.waitForSelector('div[aria-label="calculator-wrapper"]');

                page.locator('input[type="checkbox"] >> nth=-1').click();

                page.locator('input[name="length_0"]').fill('');
                page.locator('input[name="length_0"]').fill(cartonLength);
                page.locator('input[name="width_0"]').fill('');
                page.locator('input[name="width_0"]').fill(cartonWidth);
                page.locator('input[name="height_0"]').fill('');
                page.locator('input[name="height_0"]').fill(cartonHeight);
                page.locator('input[name="weight_0"]').fill('');
                page.locator('input[name="weight_0"]').fill(cartonWeight);
                page.locator('input[name="number_of_cartons_0"]').fill('');
                page.locator('input[name="number_of_cartons_0"]').fill(numberOfCartons);

                return Promise.all([
                    page.locator('button[type="submit"]').click(),
                ]);
            });
        })
        .then(() => {
            group('LandingPageCalculator: Waiting for 1 calculator step', function () {
                page.waitForSelector('button[name="question-button"]');
                page.waitForTimeout(500);

                return Promise.all([
                    page.locator('button[name="question-button"]').click(),
                ]);
            });
        })
        .then(() => {
            group('LandingPageCalculator: Waiting for 2 calculator step', function () {
                page.waitForSelector('button[name="question-button"]');
                page.waitForTimeout(500);

                return Promise.all([
                    page.locator('button[name="question-button"] >> nth=0').click(),
                ]);
            });
        })
        .then(() => {
            group('LandingPageCalculator: Waiting for 3 calculator step', function () {
                page.waitForSelector('button[name="question-button"]');
                page.waitForTimeout(500);

                return Promise.all([
                    page.locator('button[name="question-button"] >> nth=-1').click(),
                ]);
            });
        })
        .then(() => {
            group('LandingPageCalculator: Check week lb cost and enable Full price', function () {
                page.waitForSelector('h5[about="3pl-false"]');
                page.waitForTimeout(500);

                lbWeeklyCost = page.locator('h1[aria-label="calculated-price"]').textContent();

                check(page, {
                    'LandingPageCalculator[12/16]: Landing page: LB Weekly cost is displayed': lbWeeklyCost != "" && parseFloat(lbWeeklyCost) != 0,
                    'LandingPageCalculator[13/16]: Landing page: Displayed without 3PL': page.locator('h5[about="3pl-false"]').textContent() == pl3FalseText,
                });

                return Promise.all([
                    page.locator('input[type="checkbox"] >> nth=-1').click(),
                ]);
            });
        })
        .then(() => {
            group('LandingPageCalculator: Check full lb cost', function () {
                page.waitForSelector('h5[about="3pl-false"]');
                page.waitForTimeout(500);

                lbFullCost = page.locator('h1[aria-label="calculated-price"]').textContent();

                check(page, {
                    'LandingPageCalculator[14/16]: Landing page: LB Full cost is displayed': lbFullCost != "" && parseFloat(lbFullCost) != 0,
                    'LandingPageCalculator[15/16]: Landing page: LB Weekly cost and Full cost are different': parseFloat(lbFullCost) != parseFloat(lbWeeklyCost),
                    'LandingPageCalculator[16/16]: Landing page: LB and KG values are different': parseFloat(lbFullCost) != parseFloat(kgFullCost),
                });

                page.waitForTimeout(500);
            });
        })
        .finally(() => {
            page.close();
            browser.close();
        });
}