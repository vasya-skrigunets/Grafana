import { checkRespStatus, userAuth } from "./functions.js";
import exec from 'k6/execution';

// This function is performed during test setup. 
// It authorizes all types of users and returns an object with fields that are already used in all tests

const env = JSON.parse(open('./env'));

export const init = () => {
    const adminAuthResp = userAuth(env.ADMIN_URL, env.REQUEST_TIMEOUT, {
        email: env.ADMIN_EMAIL,
        password: env.ADMIN_PASSWORD
    });

    const tenantAuthResp = userAuth(env.TENANT_URL, env.REQUEST_TIMEOUT, {
        email: env.TENANT_EMAIL,
        password: env.TENANT_PASSWORD
    });

    const portalAuthResp = userAuth(env.PORTAL_URL, env.REQUEST_TIMEOUT, {
        email: env.PORTAL_EMAIL,
        password: env.PORTAL_PASSWORD
    });

    if (checkRespStatus(adminAuthResp) && checkRespStatus(tenantAuthResp) && checkRespStatus(portalAuthResp)) {
        return {
            adminEmail: env.ADMIN_EMAIL,
            tenantEmail: env.TENANT_EMAIL,
            portalEmail: env.PORTAL_EMAIL,
            adminUrl: env.ADMIN_URL,
            tenantUrl: env.TENANT_URL,
            portalUrl: env.PORTAL_URL,
            adminToken: adminAuthResp.json('access'),
            tenantToken: tenantAuthResp.json('access'),
            portalToken: portalAuthResp.json('access'),
            requestTimeout: env.REQUEST_TIMEOUT,
            runRandomly: env.RUN_RANDOMLY,
            endpointsDalay: env.DELAY_BETWEEN_ENDPOINTS
        };
    } else {
        exec.test.abort("Can't authorize users! Abort test!");
    };
}