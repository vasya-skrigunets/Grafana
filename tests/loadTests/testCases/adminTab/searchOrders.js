import { getRequest, setSession, randomInt, timeStamp, setEndpointIterationDuration } from "../../functions.js";
import { randomString } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { sleep } from "k6";

const endpointName = 'SearchOrders';

const searchIncomingOrdersAPIurl = '/api/shipments/admin/all_incoming/';
const searchOutgoingOrdersAPIurl = '/api/shipments/admin/all_outgoing/';

export function SearchOrders(initData) {
    const startIterationTime = timeStamp();
    const session = setSession(initData.adminUrl, initData.requestTimeout, initData.adminToken);

    const randomSearchParameter = randomString(randomInt(1, 4), '123456789asdfghjklmnbvcxzqwertyuiop');

    const searchIncomingOrdersResp = getRequest(session, searchIncomingOrdersAPIurl, `?search=${randomSearchParameter}`, endpointName);
    const searchOutgoingOrdersResp = getRequest(session, searchOutgoingOrdersAPIurl, `?search=${randomSearchParameter}`, endpointName);

    sleep(1);

    const endIterationTime = timeStamp();
    setEndpointIterationDuration(endIterationTime - startIterationTime, endpointName);
};