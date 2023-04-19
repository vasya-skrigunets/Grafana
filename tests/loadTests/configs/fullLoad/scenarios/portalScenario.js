import { randomArrElement, randomInt, setScenarioIterationDuration, timeStamp } from "../../../functions.js";
import { PortalTabs } from "../../../testCases/portalTab/portalTabs.js";
import { PortalSearch } from "../../../testCases/portalTab/portalSearch.js";
import { Container } from "../../../testCases/portalTab/container.js";
import { TaxRule } from "../../../testCases/portalTab/taxRule.js";

// Here we define all the endpoints (parts of the scenario)
// It is possible to run the required number of scripts randomly (no more than the maximum number of endpoints)
const endpointsArr = [PortalTabs, PortalSearch, Container, TaxRule];

export const PortalScenario = (initData) => {
    const startIterationTime = timeStamp();
    
    const randomEndpointsArr = randomArrElement(endpointsArr, randomInt(2, endpointsArr.length));

    if (initData.runRandomly) {
        for (let endpoint of randomEndpointsArr) {
            endpoint(initData);
        };
    } else {
        for (let endpoint of endpointsArr) {
            endpoint(initData);
        };
    };

    const endIterationTime = timeStamp();
    setScenarioIterationDuration(endIterationTime - startIterationTime);
};