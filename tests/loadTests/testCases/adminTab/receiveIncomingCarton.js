import { getRequest, setSession, consoleMessage, randomArrElement, postRequest, timeStamp, setEndpointIterationDuration } from "../../functions.js";
import { Trend } from "k6/metrics";
import { sleep } from "k6";

const endpointName = 'ReceiveIncomingCarton';

const mainIncomingShipmentsAPIurl = '/api/shipments/admin/incoming-shipments/';

export function ReceiveIncomingCarton(initData) {
    const startIterationTime = timeStamp();

    const session = setSession(initData.adminUrl, initData.requestTimeout, initData.adminToken);

    const getIncomingCartonsResp = getRequest(session, mainIncomingShipmentsAPIurl, "?limit=1444", endpointName);

    sleep(1);

    if (getIncomingCartonsResp && getIncomingCartonsResp.json('incoming_shipments')) {
        const incomingCartons = getIncomingCartonsResp.json('incoming_shipments').results;

        const filteredIncomingCartons = incomingCartons.filter(obj => obj.product_info_template != null && obj.warehouse_po_template != null);

        if (filteredIncomingCartons.length) {
            const randomIncomingCarton = randomArrElement(filteredIncomingCartons);

            if (randomIncomingCarton.hasOwnProperty('id')) {
                const shipmentItems = randomIncomingCarton.shipment_items;

                let requestBody = `incoming_shipment_id=${randomIncomingCarton.id}`;

                for (let [idx, obj] of shipmentItems.entries()) {
                    requestBody = requestBody + `&shipment_items[${idx}].id=${obj.id}`;
                    requestBody = requestBody + `&shipment_items[${idx}].carton_id=${obj.carton_id}`;
                    requestBody = requestBody + `&shipment_items[${idx}].sku=${obj.sku}`;
                    requestBody = requestBody + `&shipment_items[${idx}].number_of_cartons=${1}`;
                    requestBody = requestBody + `&shipment_items[${idx}].weight=${obj.weight}`;
                    requestBody = requestBody + `&shipment_items[${idx}].height=${obj.height}`;
                    requestBody = requestBody + `&shipment_items[${idx}].length=${obj.length}`;
                    requestBody = requestBody + `&shipment_items[${idx}].width=${obj.width}`;
                    requestBody = requestBody + `&shipment_items[${idx}].is_partial_delivery=${true}`;
                    requestBody = requestBody + `&shipment_items[${idx}].units_per_carton=${obj.units_per_carton}`;
                };

                const receiveCartonResp = postRequest(session, mainIncomingShipmentsAPIurl, null, endpointName, requestBody, { headers: { "Content-Type": "application/x-www-form-urlencoded" } });

                sleep(1);
            } else {
                consoleMessage("Can't find products with info template, sleep for 20 seconds");
            };
        } else {
            consoleMessage("No available incoming cartons, sleep for 20 seconds", endpointName);
            sleep(20);
        };
    } else {
        consoleMessage("Can't parse incoming cartons response", endpointName);
    };

    const endIterationTime = timeStamp();
    setEndpointIterationDuration(endIterationTime - startIterationTime, endpointName);
};