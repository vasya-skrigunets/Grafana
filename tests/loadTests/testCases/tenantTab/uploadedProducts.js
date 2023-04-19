import { getRequest, setSession, consoleMessage, randomArrElement, patchRequest, randomValueRange, timeStamp, setEndpointIterationDuration } from "../../functions.js";
import { sleep } from "k6";

const endpointName = 'UploadedProducts';

const mainUploadedProductsAPIurl = '/api/shipments/uploaded/dashboard/';

export function UploadedProducts(initData) {
    const startIterationTime = timeStamp();

    const session = setSession(initData.tenantUrl, initData.requestTimeout, initData.tenantToken);

    const getUploadedProductsResp = getRequest(session, mainUploadedProductsAPIurl, "?limit=1444", endpointName);

    sleep(1);

    const uploadedProducts = getUploadedProductsResp.json('product_list').results;

    if (uploadedProducts && uploadedProducts.length) {
        const randomProduct = randomArrElement(uploadedProducts);

        let productHsCodes = [];

        for (let obj of randomProduct.get_product_by_id.details) {
            productHsCodes.push({
                id: obj.id,
                units_per_package: obj.units_per_package,
                hs_code: (Math.random() * (9999 - 1000) + 1000).toFixed(2)
            });
        };

        const setUploadedProductRequestBody = {
            width: randomValueRange(randomProduct.width, 15, 10, 25),
            length: randomValueRange(randomProduct.length, 15, 10, 25),
            height: randomValueRange(randomProduct.height, 15, 10, 25),
            weight: randomValueRange(randomProduct.weight, 15, 10, 25),
            name: randomProduct.name,
            sku: randomProduct.sku,
            units_per_carton: randomProduct.units_per_carton,
            details: productHsCodes
        };

        const setUploadedProductResp = patchRequest(session, mainUploadedProductsAPIurl, `${randomProduct.carton_id}/`, endpointName, JSON.stringify(setUploadedProductRequestBody));
    
        sleep(1);
    } else {
        consoleMessage("Uploaded products is empty", endpointName);
    };

    const endIterationTime = timeStamp();
    setEndpointIterationDuration(endIterationTime - startIterationTime, endpointName);
};