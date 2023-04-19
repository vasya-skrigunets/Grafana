import { getRequest, setSession, timeStamp, setEndpointIterationDuration, randomInt, randomArrElement, consoleMessage } from "../../functions.js";
import { sleep } from "k6";

const endpointName = 'AddProductToContainer';

const tenantTypeAPIurl = '/api/tenants/tenant-type/';

const containersListAPIurl = '/api/ff/containers_list/';

const ordersListAPIurl = '/api/ff/orders_list/';
const typesRelation = [
    {
        containerType: 'REGULAR',
        orderType: 'SLOW',
    },
    {
        containerType: 'CLXPLUS',
        orderType: 'MEDIUM',
    },
    {
        containerType: 'CLXEXPRESS',
        orderType: 'FAST',
    }
];

export function AddProductToContainer(initData) {
    const startIterationTime = timeStamp();

    const session = setSession(initData.portalUrl, initData.requestTimeout, initData.portalToken);

    const getTenantTypeResp = getRequest(session, tenantTypeAPIurl, null, endpointName);
    sleep(1);
    
    if (getTenantTypeResp && getTenantTypeResp.body && getTenantTypeResp.json().hasOwnProperty('id')) {
        const userId = getTenantTypeResp.json('id');

        for (let obj of typesRelation) {
            const containersListResp = getRequest(session, containersListAPIurl, `${userId}/${obj.containerType}/?limit=1444`, endpointName);
            const ordersListResp = getRequest(session, ordersListAPIurl, `${obj.orderType}/?limit=1444`, endpointName);
            sleep(1);
        };
    } else {
        consoleMessage("Cant parse tenant type response", endpointName);
    };

    const endIterationTime = timeStamp();
    setEndpointIterationDuration(endIterationTime - startIterationTime, endpointName);
};