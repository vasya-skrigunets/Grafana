import { getRequest, setSession, consoleMessage, randomArrElement, postRequest, timeStamp, randomInt, customFormBoundary, setEndpointIterationDuration } from "../../functions.js";
import { FormData } from "https://jslib.k6.io/formdata/0.0.2/index.js";
import { sleep } from "k6";

const endpointName = 'SendProductToSkudrop';

const mainPrepareToShipProductsAPIurl = '/api/shipments/prepare-to-ship/';

export function SendProductToSkudrop(initData) {
    const startIterationTime = timeStamp();

    const session = setSession(initData.tenantUrl, initData.requestTimeout, initData.tenantToken);

    const getPrepareToShipProductsResp = getRequest(session, mainPrepareToShipProductsAPIurl, '?limit=1444', endpointName);

    sleep(1);

    if (getPrepareToShipProductsResp && getPrepareToShipProductsResp.json('results')) {
        const prepareToShipProducts = getPrepareToShipProductsResp.json('results');
        const randomPrepareToShipProduct = randomArrElement(prepareToShipProducts);

        const randomPrepareToShipProductDetails = randomPrepareToShipProduct.details;

        const date = new Date();

        let requestBody = {
            carton_id: randomPrepareToShipProduct.carton_with_product.carton_id,
            number_of_cartons: randomInt(5, 10),
            sku: randomPrepareToShipProduct.sku,
            product_name: randomPrepareToShipProduct.name,
            estimated_delivery_time: date.toISOString().split('T')[0],
            contact_person_phone: randomPrepareToShipProduct.factory.contact_person_phone,
            contact_person_name: randomPrepareToShipProduct.factory.contact_person_name,
            factory_name: randomPrepareToShipProduct.factory.factory_name,
            details_quantity: randomPrepareToShipProduct.details.length,
        };

        for (let [idx, obj] of randomPrepareToShipProductDetails.entries()) {
            requestBody[`unit_price_detail_${idx}`] = obj.unit_price;
            requestBody[`purpose_detail_${idx}`] = obj.purpose;
            requestBody[`id_detail_${idx}`] = obj.id;
        };

        const randomBoundary = customFormBoundary();

        let formData = new FormData();

        formData.boundary = randomBoundary;

        formData.append('0', JSON.stringify(requestBody));

        const setPrepareToShipProductResp = postRequest(session, mainPrepareToShipProductsAPIurl, null, endpointName, formData.body(), { headers: { "Content-Type": `multipart/form-data; boundary=${randomBoundary}` } });

        sleep(1);
    } else {
        consoleMessage("No available prepare to ship products, skip iteration", endpointName);
    };

    const endIterationTime = timeStamp();
    setEndpointIterationDuration(endIterationTime - startIterationTime, endpointName);
};