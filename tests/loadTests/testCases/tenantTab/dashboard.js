import { getRequest, setSession, decodeToken, timeStamp, setEndpointIterationDuration } from "../../functions.js";
import { sleep } from "k6";

const endpointName = 'Dashboard';

const tenantDashboardAPIurls = [
    '/api/tenants/tenant-type/',
    '/api/shipments/incoming-shipments/?limit=1444',
    '/api/shipments/outgoing-shipments/?limit=1444',
    '/api/shipments/stored/dashboard/?limit=1444',
    '/api/shipments/uploaded/dashboard/?limit=1444',
    '/api/shipments/brand/dashboard/',
    '/api/tenants/users-memberes/?limit=1000',
    '/api/shipments/requires-actions/dashboard/',
    '/api/tenants/tenant-type/',
    '/api/notifications/?limit=5',
];

export function Dashboard(initData) {
    const startIterationTime = timeStamp();

    const session = setSession(initData.tenantUrl, initData.requestTimeout, initData.tenantToken);

    const userID = decodeToken(initData.tenantToken);
    getRequest(session, '/api/users/', `${userID}`, endpointName);

    for (let api of tenantDashboardAPIurls) {
        getRequest(session, api, null, endpointName);
    }

    sleep(1);

    const endIterationTime = timeStamp();
    setEndpointIterationDuration(endIterationTime - startIterationTime, endpointName);
};