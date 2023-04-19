import { check, group } from 'k6';
import { chromium } from 'k6/x/browser';

export function HelpSection() {
    const url = 'https://test.dev.skudrop.com/login';

    const email = 'admin@example.com';
    const password = 'admin';

    const totalUnitsStoredTitle = "Total Units Stored";
    const helpSectionPageTitle = "Help section";
    
    const firstVideoTitle = "Understanding the dashboard";
    const lastVideoTitle = "How to get help";

    const knowledgeBaseButtonLink = "https://www.youtube.com/@skudrop/videos";
    const firstVideoSrc = "https://skudrop-videos.s3.us-west-1.amazonaws.com/Understanding_the_dashboard.mp4";
    const lastVideoSrc = "https://skudrop-videos.s3.us-west-1.amazonaws.com/How_to_get_help.mp4";

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
            group('HelpSection: Visit login page and authorization', function () {
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
            group('HelpSection: Waiting for Dashboard page and go to Help Section page', function () {
                page.waitForSelector('div[aria-label="total-units-stored"] > h1 >> nth=0');

                check(page, {
                    'HelpSection[1/7]: Dashboard: Page is visible and content match': page.locator('div[aria-label="total-units-stored"] > p >> nth=0').isVisible() && page.locator('div[aria-label="total-units-stored"] > p >> nth=0').textContent() == totalUnitsStoredTitle,
                    'HelpSection[2/7]: Dashboard: Button (Knowledge Base) is visible and has correct link': page.locator('a[about="knowledge-base-link"]').isVisible() && page.locator('a[about="knowledge-base-link"]').getAttribute('href') == knowledgeBaseButtonLink,
                    'HelpSection[3/7]: Dashboard: Button (Help Section) is visible and enabled': page.locator('div[aria-label="help-section-button"]').isVisible() && page.locator('div[aria-label="help-section-button"]').isEnabled(),
                });

                return Promise.all([
                    page.waitForNavigation(),
                    page.locator('div[aria-label="help-section-button"]').click(),
                ]);
            });
        })
        .then(() => {
            group('HelpSection: Wait for Help Section page and check it', function () {
                page.waitForSelector('div[aria-label="help-section-page"]');

                page.waitForTimeout(3000);

                check(page, {
                    'HelpSection[4/7]: Help Section: Page is visible and content match': page.locator('div[aria-label="help-section-page"]').isVisible() && page.locator('div[aria-label="help-section-page"] > h3 >> nth=0').textContent() == helpSectionPageTitle,
                    'HelpSection[5/7]: Help Section: Button (Youtube link) is visible and has correct link': page.locator('a[about="youtube-link"]').isVisible() && page.locator('a[about="youtube-link"]').getAttribute('href') == knowledgeBaseButtonLink,
                    'HelpSection[6/7]: Help Section: Video (Understanding the dashboard) is visible and has correct src-attribute': page.locator('video[width="100%"] >> nth=0').isVisible() && page.locator('video[width="100%"] > source >> nth=0').getAttribute('src') == firstVideoSrc,
                    'HelpSection[7/7]: Help Section: Video (How to get help) is visible and has correct src-attribute': page.locator('video[width="100%"] >> nth=-1').isVisible() && page.locator('video[width="100%"] > source >> nth=-1').getAttribute('src') == lastVideoSrc,
                });
            });
        })
        .finally(() => {
            page.close();
            browser.close();
        });
}