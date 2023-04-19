import { sleep } from "k6";
import { setScenarioIterationDuration, timeStamp } from "../../../functions.js";
import { Dashboard } from "../../../testCases/tenantTab/dashboard.js";
import { SendProductToAmazon } from "../../../testCases/tenantTab/sendProductToAmazon.js";

export const TenantScenario = (initData) => {
    const startIterationTime = timeStamp();
    
    Dashboard(initData);

    sleep(initData.endpointsDalay);

    SendProductToAmazon(initData);

    sleep(60*60*8);

    const endIterationTime = timeStamp();
    setScenarioIterationDuration(endIterationTime - startIterationTime);
};