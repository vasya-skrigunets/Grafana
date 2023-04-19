import { setScenarioIterationDuration, timeStamp } from "../../../functions.js";
import { PortalTabs } from "../../../testCases/portalTab/portalTabs.js";

export const PortalScenario = (initData) => {
    const startIterationTime = timeStamp();
    
    PortalTabs(initData);

    const endIterationTime = timeStamp();
    setScenarioIterationDuration(endIterationTime - startIterationTime);
};