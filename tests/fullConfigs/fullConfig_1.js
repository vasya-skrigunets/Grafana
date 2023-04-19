export { SendProductToAmazon } from "../smokeTest/tenantTab/sendProductToAmazon.js";
export { SendProductToSkudrop } from "../smokeTest/tenantTab/sendProductToSkudrop.js";
export { IncomingCartons } from "../smokeTest/adminTab/incomingCartons.js";

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
        SendProductToAmazon: {
            exec: 'SendProductToAmazon',
            executor: 'per-vu-iterations',
            startTime: '0s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
        SendProductToSkudrop: {
            exec: 'SendProductToSkudrop',
            executor: 'per-vu-iterations',
            startTime: '30s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
        IncomingCartons: {
            exec: 'IncomingCartons',
            executor: 'per-vu-iterations',
            startTime: '55s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
    },
};