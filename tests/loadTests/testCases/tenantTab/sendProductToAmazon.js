import { getRequest, setSession, consoleMessage, randomArrElement, postRequest, timeStamp, setEndpointIterationDuration } from "../../functions.js";
import { sleep } from "k6";

const endpointName = 'SendProductToAmazon';

const shipmentPlanAPIurl = '/api/amazon_mws/shipment-plan/';
const inboundShipmentsAPIurl = '/api/amazon_mws/inbound-shipment/';

export function SendProductToAmazon(initData) {
    const startIterationTime = timeStamp();

    const session = setSession(initData.tenantUrl, initData.requestTimeout, initData.tenantToken);

    const getProductsResp = getRequest(session, shipmentPlanAPIurl, '?limit=1444', endpointName);
    sleep(1);

    if (getProductsResp && getProductsResp.body && getProductsResp.json().hasOwnProperty('results')) {
        const products = getProductsResp.json('results');
        const filteredProducts = products.find(obj => {
            return obj.sku === "Collar-003";
        });
        
        const createShipmentPlanRequestBody = {
            cartons:[{
                asin: filteredProducts.asin,
                number_of_units: filteredProducts.get_cartons_data_for_product_ship_to_amazon.number_of_units / filteredProducts.get_cartons_data_for_product_ship_to_amazon.number_of_cartons,
                ship_to_country_code: filteredProducts.ship_to_country_code,
                sku: filteredProducts.sku,
                template_carton_id: filteredProducts.get_cartons_data_for_product_ship_to_amazon.template_carton_id
            }]
        }

        const createShipmentPlanResponce = postRequest(session, shipmentPlanAPIurl, null, endpointName, JSON.stringify(createShipmentPlanRequestBody));
        sleep(1);

        const getInboundShipments = getRequest(session, inboundShipmentsAPIurl, null, endpointName);
        sleep(1);

        if (getInboundShipments && getInboundShipments.body && getInboundShipments.json().hasOwnProperty('results')) {
            const inboundShipments = getInboundShipments.json('results');
            const randomInboundShipment = randomArrElement(inboundShipments);

            const confirmShippingRequestBody = [{
                shipment_id: randomInboundShipment.shipment_id,
                shipment_speed_type: "MEDIUM",
                last_mile_carrier: "UPS"
            }];

            const confirmShippingResp = postRequest(session, inboundShipmentsAPIurl, null, endpointName, JSON.stringify(confirmShippingRequestBody));
            sleep(1);
            
            console.log(confirmShippingResp);
        } else {
            consoleMessage("Can't parse inbound shipments response", endpointName);
        };
    } else {
        consoleMessage("Can't parse products response", endpointName);
    };

    const endIterationTime = timeStamp();
    setEndpointIterationDuration(endIterationTime - startIterationTime, endpointName);
};