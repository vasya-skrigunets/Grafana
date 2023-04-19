import { decodeToken, getRequest, setEndpointIterationDuration, setSession, timeStamp } from "../../functions.js";
import { sleep } from "k6";

const endpointName = 'AdminTabs';

const adminTabsApiURLs = [
    '/api/shipments/admin/all_incoming/?limit=1444',
    '/api/shipments/admin/all_outgoing/?limit=1444',
    '/api/shipments/admin/incoming-shipments/',
    '/api/shipments/incoming-shipments/',
    '/api/shipments/admin/order-to-ship/?limit=1444',
    '/api/shipments/admin/product-stored/',
    '/api/shipments/admin/order-to-prep/?limit=1444',
    '/api/shipments/admin/order-tracking/?limit=1444',
    '/api/shipments/admin/tariff-management/?limit=1444',
    '/api/notifications/?limit=10',
    '/api/tenants/tenant-type/'
];

export function AdminTabs(initData) {
    const startIterationTime = timeStamp();
    
    const session = setSession(initData.adminUrl, initData.requestTimeout, initData.adminToken);

    const userID = decodeToken(initData.adminToken);
    getRequest(session, '/api/users/', `${userID}/`, endpointName);

    for (let api of adminTabsApiURLs) {
        getRequest(session, api, null, endpointName);
    };

    sleep(1);
    
    const endIterationTime = timeStamp();
    setEndpointIterationDuration(endIterationTime - startIterationTime, endpointName);
};