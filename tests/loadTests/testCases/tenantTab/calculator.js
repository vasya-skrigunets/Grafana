import { getRequest, setSession, randomInt, randomArrElement, consoleMessage, postRequest, timeStamp, setEndpointIterationDuration } from "../../functions.js";
import { sleep } from "k6";

const endpointName = 'Calculator';

const mainCalculatorAPIurl = '/api/rates/calculator/';

export function Calculator(initData) {
    const startIterationTime = timeStamp();

    const session = setSession(initData.tenantUrl, initData.requestTimeout, initData.tenantToken);

    const getWarehouseIdsResp = getRequest(session, mainCalculatorAPIurl, null, endpointName);

    sleep(1);

    if (getWarehouseIdsResp && getWarehouseIdsResp.json('warehouse_ids')) {
    
    const receivedWarehouseIds = getWarehouseIdsResp.json('warehouse_ids');
        const randomWeight = randomInt(10, 20);
        const randomLength = randomInt(10, 20);
        const randomWidth = randomInt(10, 20);
        const randomHeight = randomInt(10, 20);
        const randomNumberOfCartons = randomInt(4, 24);
        const randomWarehouseId = randomArrElement(receivedWarehouseIds);

        const calculateCostRequestBody = {
            cartons: [
                {
                    weight: randomWeight,
                    weight_measure: randomArrElement(["kg", "pound"]),
                    length: randomLength,
                    width: randomWidth,
                    height: randomHeight,
                    dimensions_measure: randomArrElement(["cm", "inch"]),
                    number_of_cartons: randomNumberOfCartons
                }
            ],
            quantity_of_month: Math.floor(randomNumberOfCartons / 4),
            warehouse_id: randomWarehouseId
        };

        const calculateCostResp = postRequest(session, mainCalculatorAPIurl, null, endpointName, JSON.stringify(calculateCostRequestBody))

        if (calculateCostResp && calculateCostResp.status == 201 && (!parseFloat(calculateCostResp.json('final_price')) || !parseFloat(calculateCostResp.json('weekly_price')))) {
            consoleMessage("Calculator has bad answer!", endpointName);
        };

        sleep(1);
    } else {
        consoleMessage("Received warehouse ids response has bad data", endpointName);
    };

    const endIterationTime = timeStamp();
    setEndpointIterationDuration(endIterationTime - startIterationTime, endpointName);
};