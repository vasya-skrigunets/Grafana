export { SetAvailableProductCartons_CompleteOrder } from "../fullTest/adminTab/setAvailableProductCartons_CompleteOrder.js";
export { CheckAvailableProductCartons } from "../fullTest/tenantTab/checkAvailableProductCartons.js";
export { PortalContainer } from "../fullTest/portalTab/portalContainer.js";

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
        SetAvailableProductCartons_CompleteOrder: {
            exec: 'SetAvailableProductCartons_CompleteOrder',
            executor: 'per-vu-iterations',
            startTime: '0s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
        CheckAvailableProductCartons: {
            exec: 'CheckAvailableProductCartons',
            executor: 'per-vu-iterations',
            startTime: '25s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
        PortalContainer: {
            exec: 'PortalContainer',
            executor: 'per-vu-iterations',
            startTime: '50s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
    },
};