export { AddNewWarehouse } from "../fullTest/adminTab/addNewWarehouse.js";
export { CreateNotification } from "../fullTest/adminTab/createNotification.js";
export { CheckNotification } from "../fullTest/tenantTab/checkNotification.js";

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
        AddNewWarehouse: {
            exec: 'AddNewWarehouse',
            executor: 'per-vu-iterations',
            startTime: '0s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
        CreateNotification: {
            exec: 'CreateNotification',
            executor: 'per-vu-iterations',
            startTime: '30s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
        CheckNotification: {
            exec: 'CheckNotification',
            executor: 'per-vu-iterations',
            startTime: '55s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
    },
};