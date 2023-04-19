import { getRequest, setEndpointIterationDuration, setSession, timeStamp } from "../../functions.js";
import { sleep } from "k6";

const endpointName = 'OrdersToPrep';

const ordersToPrepApiURL = "/api/shipments/admin/order-to-prep/";

export function OrdersToPrep(initData) {
    const startIterationTime = timeStamp();
    
    const session = setSession(initData.adminUrl, initData.requestTimeout, initData.adminToken);

    const getOrdersToPrep = getRequest(session, ordersToPrepApiURL, '?limit=1444', endpointName);

    if (getOrdersToPrep && getOrdersToPrep.body && getOrdersToPrep.json().hasOwnProperty('prep_orders')) {
        const ordersToPrep = getOrdersToPrep.json("prep_orders").results;

    } else {
        consoleMessage("Can't parse orders to prep response", endpointName);
    };
    
    const endIterationTime = timeStamp();
    setEndpointIterationDuration(endIterationTime - startIterationTime, endpointName);
};