export { ChargingRates } from "../fullTest/adminTab/chargingRates.js";
export { HelpSection } from "../fullTest/tenantTab/helpSection.js";
export { ReceiveIncomingCarton } from "../fullTest/adminTab/receiveIncomingCarton.js";
export { CheckUpdatingProduct } from "../fullTest/tenantTab/checkUpdatingProduct.js";

export const options = {
    insecureSkipTLSVerify: true,
    thresholds: {
        checks: [
            {
                threshold: 'rate>0.99',
                abortOnFail: true,
                delayAbortEval: '10s',
            },
        ],
    },
    scenarios: {
        ChargingRates: {
            exec: 'ChargingRates',
            executor: 'per-vu-iterations',
            startTime: '0s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
        HelpSection: {
            exec: 'HelpSection',
            executor: 'per-vu-iterations',
            startTime: '30s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
        ReceiveIncomingCarton: {
            exec: 'ReceiveIncomingCarton',
            executor: 'per-vu-iterations',
            startTime: '60s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
        CheckUpdatingProduct: {
            exec: 'CheckUpdatingProduct',
            executor: 'per-vu-iterations',
            startTime: '90s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
    },
};