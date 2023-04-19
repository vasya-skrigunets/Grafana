import { getRequest, setSession, randomInt, consoleMessage, timeStamp, setEndpointIterationDuration } from "../../functions.js";
import { randomString } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { sleep } from "k6";

const endpointName = 'PortalSearch';

const tenantTypeAPIurl = '/api/tenants/tenant-type/';

const shipmentAPIurls = [
    '/api/ff/hs_codes_tariff_list/',
    '/api/ff/shipment_details_list/AIR_REGULAR/',
    '/api/ff/shipment_details_list/ALL/'
];

const mainContainerAPIurl = '/api/ff/containers_list/';

const preparedContainerTypes = ['REGULAR', 'CLXPLUS', 'CLXEXPRESS'];

export function PortalSearch(initData) {
    const startIterationTime = timeStamp();

    const session = setSession(initData.portalUrl, initData.requestTimeout, initData.portalToken);

    const getTenantTypeResp = getRequest(session, tenantTypeAPIurl, null, endpointName);
    
    sleep(1);

    const userID = getTenantTypeResp.json('id');
    
    const randomSearchParameter = randomString(randomInt(1, 5), '123456789asdfghjklmnbvcxzqwertyuiop');

    for (let api of shipmentAPIurls) {
        getRequest(session, api, `?search=${randomSearchParameter}`, endpointName);
        sleep(1);
    };

    if (userID) {
        for (let type of preparedContainerTypes) {
            getRequest(session, mainContainerAPIurl, `${userID}/${type}/?search=${randomSearchParameter}`, endpointName);
            sleep(1);
        };
    } else {
        consoleMessage("Can't get user id, interrupting iteration", endpointName);
    };

    const endIterationTime = timeStamp();
    setEndpointIterationDuration(endIterationTime - startIterationTime, endpointName);
};