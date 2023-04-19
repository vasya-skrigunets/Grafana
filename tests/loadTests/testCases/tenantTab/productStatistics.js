import { getRequest, setSession, timeStamp, setEndpointIterationDuration } from "../../functions.js";
import { sleep } from "k6";

const endpointName = 'ProductStatistics';

const APIurls = [
    '/api/shipments/prepare-to-ship/',
    '/api/integrations/actions-integration/',
    '/api/shipments/user/dashboard/incoming-shipment-history/',
    '/api/shipments/user/dashboard/outgoing-shipment-history/',
];

export function ProductStatistics(initData) {
    const startIterationTime = timeStamp();

    const session = setSession(initData.tenantUrl, initData.requestTimeout, initData.tenantToken);

    for (let api of APIurls) {
        getRequest(session, api, null, endpointName);
    };

    sleep(1);

    const endIterationTime = timeStamp();
    setEndpointIterationDuration(endIterationTime - startIterationTime, endpointName);
};