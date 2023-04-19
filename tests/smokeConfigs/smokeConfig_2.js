export { IncomingCartons } from "../smokeTest/adminTab/incomingCartons.js";
export { AddProductsOrBrands } from "../smokeTest/tenantTab/addProductsOrBrands.js";

export const options = {
    insecureSkipTLSVerify: true,
    thresholds: {
        checks: [
            {
                threshold: 'rate>0.99',
                abortOnFail: true,
                delayAbortEval: '5s',
            },
        ],
    },
    scenarios: {
        IncomingCartons: {
            exec: 'IncomingCartons',
            executor: 'per-vu-iterations',
            startTime: '0s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
        AddProductsOrBrands: {
            exec: 'AddProductsOrBrands',
            executor: 'per-vu-iterations',
            startTime: '30s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
    },
};