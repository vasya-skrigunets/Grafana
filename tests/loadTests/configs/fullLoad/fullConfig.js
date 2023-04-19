import { init } from "../../init.js";
import { currentDateTime } from "../../functions.js";
export { AdminScenario } from "./scenarios/adminScenario.js";
export { PortalScenario } from "./scenarios/portalScenario.js";
export { TenantScenario } from "./scenarios/tenantScenario.js";

// Data for the test is configured here.
// It returns an object that can be retrieved from the props of all scenarios
export function setup() {
    console.info(`Test Start Time (UTC): ${currentDateTime()}`);
    return init();
};

export const options = {
    insecureSkipTLSVerify: true,
    // minIterationDuration: '60s',
    scenarios: {
        TenantScenario: {
            exec: 'TenantScenario',
            // executor: 'shared-iterations',
            // maxDuration: "30m",
            // vus: 1,
            // iterations: 1
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '1m', target: 10 },
                { duration: '2m', target: 30 },
                { duration: '4m', target: 50 },
                { duration: '10m', target: 100 },

                { duration: '4h', target: 3334 },
                { duration: '2h', target: 1 },
                { duration: '15m', target: 0 },
            ],
            gracefulRampDown: '300s',
            gracefulStop: '300s',
        },
        AdminScenario: {
            exec: 'AdminScenario',
            // executor: 'shared-iterations',
            // maxDuration: "30m",
            // vus: 1,
            // iterations: 1
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '1m', target: 10 },
                { duration: '2m', target: 30 },
                { duration: '4m', target: 50 },
                { duration: '10m', target: 100 },

                { duration: '4h', target: 3334 },
                { duration: '2h', target: 1 },
                { duration: '15m', target: 0 },
            ],
            gracefulRampDown: '300s',
            gracefulStop: '300s',
        },
        PortalScenario: {
            exec: 'PortalScenario',
            // executor: 'shared-iterations',
            // maxDuration: "30m",
            // vus: 1,
            // iterations: 1
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '1m', target: 10 },
                { duration: '2m', target: 30 },
                { duration: '4m', target: 50 },
                { duration: '10m', target: 100 },

                { duration: '4h', target: 3334 },
                { duration: '2h', target: 1 },
                { duration: '15m', target: 0 },
            ],
            gracefulRampDown: '300s',
            gracefulStop: '300s',
        },
    },
};

export function teardown() {
    console.info(`Test End Time (UTC): ${currentDateTime()}`);
};