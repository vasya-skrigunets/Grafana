export { AffiliateProgram } from "../fullTest/adminTab/affiliateProgram.js";
export { ApplyAffiliate } from "../fullTest/tenantTab/applyAffiliate.js";
export { UpdateProductDimension } from "../fullTest/tenantTab/updateProductDimension.js";
export { LandingPageCalculator } from "../fullTest/tenantTab/landingPageCalculator.js";

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
        UpdateProductDimension: {
            exec: 'UpdateProductDimension',
            executor: 'per-vu-iterations',
            startTime: '0s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
        AffiliateProgram: {
            exec: 'AffiliateProgram',
            executor: 'per-vu-iterations',
            startTime: '30s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
        ApplyAffiliate: {
            exec: 'ApplyAffiliate',
            executor: 'per-vu-iterations',
            startTime: '60s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
        LandingPageCalculator: {
            exec: 'LandingPageCalculator',
            executor: 'per-vu-iterations',
            startTime: '85s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
    },
};