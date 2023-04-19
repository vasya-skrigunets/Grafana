import { sleep } from "k6";
import { setScenarioIterationDuration, timeStamp } from "../../../functions.js";
import { AdminTabs } from "../../../testCases/adminTab/adminTabs.js";
import { OrdersToPrep } from "../../../testCases/adminTab/ordersToPrep.js";

export const AdminScenario = (initData) => {
    const startIterationTime = timeStamp();
    
    AdminTabs(initData);

    sleep(initData.endpointsDalay);

    OrdersToPrep(initData);

    sleep(1500);

    const endIterationTime = timeStamp();
    setScenarioIterationDuration(endIterationTime - startIterationTime);
};