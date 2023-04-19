import { getRequest, setSession, timeStamp, setEndpointIterationDuration, randomInt, randomArrElement, consoleMessage } from "../../functions.js";
import { sleep } from "k6";

const endpointName = 'PortalTabs';

const tenantTypeAPIurl = '/api/tenants/tenant-type/';

const shipmentDetailsListAPIurl = '/api/ff/shipment_details_list/';
const seaShipmentDeliveryTypes = ['TRUCK+CBM', 'TRUCK+KG', 'UPS+CBM', 'UPS+KG'];
const airShipmentDeliveryType = 'AIR_REGULAR';

const invoicesListAPIurl = '/api/ff/invoices_list/';

const hsCodesListAPIurl = '/api/ff/hs_codes_tariff_list/';

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

export function PortalTabs(initData) {
    const startIterationTime = timeStamp();

    const session = setSession(initData.portalUrl, initData.requestTimeout, initData.portalToken);

    for (let i = 0; i <= randomInt(1, 2); i++) {
        getRequest(session, shipmentDetailsListAPIurl, `${randomArrElement(seaShipmentDeliveryTypes)}/?limit=1444&`, endpointName);
        sleep(1);
    };

    const airShipmentsListResponse = getRequest(session, shipmentDetailsListAPIurl, `${airShipmentDeliveryType}/?limit=1444&`, endpointName);
    sleep(1);

    const getTenantTypeResp = getRequest(session, tenantTypeAPIurl, null, endpointName);
    sleep(1);

    const getHsCodesListResponse = getRequest(session, hsCodesListAPIurl, '?limit=1444&', endpointName);
    sleep(1);
    
    if (getTenantTypeResp && getTenantTypeResp.body) {
        const userId = getTenantTypeResp.json('id');

        for (let i = 0; i <= randomInt(1, 2); i++) {
            const randomType = randomArrElement(typesRelation);
            getRequest(session, containersListAPIurl, `${userId}/${randomType.containerType}/?limit=1444`, endpointName);
            getRequest(session, ordersListAPIurl, `${randomType.orderType}/?limit=1444`, endpointName);
            sleep(1);
        };

        for (let i = 0; i <= randomInt(1, 2); i++) {
            getRequest(session, invoicesListAPIurl, `${userId}/${randomArrElement(typesRelation).containerType}/?limit=1444`, endpointName);
            sleep(1);
        };
    } else {
        consoleMessage("Cant find user ID", endpointName);
    };

    const endIterationTime = timeStamp();
    setEndpointIterationDuration(endIterationTime - startIterationTime, endpointName);
};