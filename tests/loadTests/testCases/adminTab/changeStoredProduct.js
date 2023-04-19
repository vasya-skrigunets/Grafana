import { getRequest, patchRequest, setSession, randomArrElement, randomInt, randomValueRange, consoleMessage, timeStamp, setEndpointIterationDuration } from "../../functions.js";
import { sleep } from "k6";

const endpointName = 'ChangeStoredProduct';

const mainStoredProductsAPIurl = '/api/shipments/admin/product-stored/';
const preparedCartonKeys = ['height', 'length', 'number_of_cartons', 'units_per_carton', 'weight', 'width'];

export function ChangeStoredProduct(initData) {
    const startIterationTime = timeStamp();
    
    const session = setSession(initData.adminUrl, initData.requestTimeout, initData.adminToken);

    const getAllProductsResp = getRequest(session, mainStoredProductsAPIurl, '?limit=1444', endpointName);

    sleep(1);

    const storedProducts = getAllProductsResp.json('cartons_stored').results;
    
    if (storedProducts.length) {
        const randomProduct = randomArrElement(storedProducts);
        const randomProductCarton = randomArrElement(randomProduct.get_cartons_data_for_product_in_warehouse.details);
    
        let hsDetails = [];

        for (let hs of randomProduct.details) {
            hsDetails.push({
                hs_code: (Math.random() * (9999 - 1000) + 1000).toFixed(2),
                id: hs.id,
                purpose: hs.purpose,
                units_per_package: hs.units_per_package
            });
        };

        let setProductParametersRequestBody = {
            details: hsDetails,
            width: randomProductCarton.width,
            height: randomProductCarton.height,
            length: randomProductCarton.length,
            weight: randomProductCarton.weight,
            units_per_carton: randomProductCarton.units_per_carton,
            stored_number_of_cartons: randomProductCarton.number_of_cartons
        };
    
        for (let i = 0; i < randomInt(1, 4); i++) {
            let randomKey = randomArrElement(preparedCartonKeys);
            setProductParametersRequestBody[randomKey] = randomValueRange(randomProductCarton[randomKey]);
        };

        // console.log(randomProductCarton.carton_id);
        // console.log(setProductParametersRequestBody);
    
        const setProductParametersResp = patchRequest(session, mainStoredProductsAPIurl, `${randomProductCarton.carton_id}/`, endpointName, JSON.stringify(setProductParametersRequestBody));
    
        sleep(1);
    } else {
        consoleMessage("Has no available stored cartons", endpointName);
    };

    const endIterationTime = timeStamp();
    setEndpointIterationDuration(endIterationTime - startIterationTime, endpointName);
};