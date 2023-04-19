import { randomArrElement, randomInt, setScenarioIterationDuration, timeStamp } from "../../../functions.js";
import { AdminTabs } from "../../../testCases/adminTab/adminTabs.js";
import { SearchOrders } from "../../../testCases/adminTab/searchOrders.js";
import { ReceiveIncomingCarton } from "../../../testCases/adminTab/receiveIncomingCarton.js";
import { ChangeStoredProduct } from "../../../testCases/adminTab/changeStoredProduct.js";
import { AffiliateProgram } from "../../../testCases/adminTab/affiliateProgram.js";
import { ChargingRates } from "../../../testCases/adminTab/chargingRates.js";
import { UserCommunication } from "../../../testCases/adminTab/userCommunication.js";
import { UserRoles } from "../../../testCases/adminTab/userRoles.js";
import { ShipAddress } from "../../../testCases/adminTab/shipAddress.js";
import { Warehouse } from "../../../testCases/adminTab/warehouse.js";
import { Statistics } from "../../../testCases/adminTab/statistics.js";

// Here we define all the endpoints (parts of the scenario)
// It is possible to run the required number of scripts randomly (no more than the maximum number of endpoints)

// ChangeStoredProduct is not included
const endpointsArr = [AdminTabs, SearchOrders, ReceiveIncomingCarton, AffiliateProgram, ChargingRates, UserCommunication, UserRoles, ShipAddress, Warehouse, Statistics];

export const AdminScenario = (initData) => {
    const startIterationTime = timeStamp();
    
    const randomEndpointsArr = randomArrElement(endpointsArr, randomInt(9, endpointsArr.length));
    
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