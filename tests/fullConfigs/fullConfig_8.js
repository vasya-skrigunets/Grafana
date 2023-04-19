export { TaxRule } from "../fullTest/portalTab/taxRule.js";
export { ChangeUserData } from "../fullTest/tenantTab/changeUserData.js";
export { DeleteTenant } from "../fullTest/adminTab/deleteTenant.js";

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
        TaxRule: {
            exec: 'TaxRule',
            executor: 'per-vu-iterations',
            startTime: '0s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
        ChangeUserData: {
            exec: 'ChangeUserData',
            executor: 'per-vu-iterations',
            startTime: '25s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
        // DeleteTenant: {
        //     exec: 'DeleteTenant',
        //     executor: 'per-vu-iterations',
        //     startTime: '55s',
        //     maxDuration: '1m',
        //     gracefulStop: '1m',
        //     vus: 1,
        // },
    },
};