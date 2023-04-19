export { WarehouseDasboardTabs } from "../smokeTest/adminTab/warehouseDasboardTabs.js";
export { WarehouseDasboardTabs2 } from "../smokeTest/adminTab/warehouseDasboardTabs2.js";

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
        WarehouseDasboardTabs: {
            exec: 'WarehouseDasboardTabs',
            executor: 'per-vu-iterations',
            startTime: '0s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
        WarehouseDasboardTabs2: {
            exec: 'WarehouseDasboardTabs2',
            executor: 'per-vu-iterations',
            startTime: '30s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
    },
};