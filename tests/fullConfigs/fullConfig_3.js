export { Roles } from "../fullTest/adminTab/roles.js";
export { AddShipAddress } from "../fullTest/adminTab/addShipAddress.js";
export { SendProductToAmazon_AvailableCartons } from "../fullTest/tenantTab/sendProductToAmazon_AvailableCartons.js";
export { SendProductToAmazon_PortalContainer } from "../fullTest/tenantTab/sendProductToAmazon_PortalContainer.js";

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
        SendProductToAmazon_PortalContainer: {
            exec: 'SendProductToAmazon_PortalContainer',
            executor: 'per-vu-iterations',
            startTime: '0s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
        SendProductToAmazon_AvailableCartons: {
            exec: 'SendProductToAmazon_AvailableCartons',
            executor: 'per-vu-iterations',
            startTime: '30s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
        Roles: {
            exec: 'Roles',
            executor: 'per-vu-iterations',
            startTime: '60s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
        AddShipAddress: {
            exec: 'AddShipAddress',
            executor: 'per-vu-iterations',
            startTime: '85s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
    },
};