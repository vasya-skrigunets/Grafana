import { randomArrElement, randomInt, setScenarioIterationDuration, timeStamp } from "../../../functions.js";
import { Calculator } from "../../../testCases/tenantTab/calculator.js";
import { Dashboard } from "../../../testCases/tenantTab/dashboard.js";
import { Notifications } from "../../../testCases/tenantTab/notifications.js";
import { ProductStatistics } from "../../../testCases/tenantTab/productStatistics.js";
import { UploadedProducts } from "../../../testCases/tenantTab/uploadedProducts.js";
import { SendProductToSkudrop } from "../../../testCases/tenantTab/sendProductToSkudrop.js";
import { UserManagement } from "../../../testCases/tenantTab/userManagement.js";
import { BillingAddress } from "../../../testCases/tenantTab/billingAddress.js";
import { Profile } from "../../../testCases/tenantTab/profile.js";

// Here we define all the endpoints (parts of the scenario)
// It is possible to run the required number of scripts randomly (no more than the maximum number of endpoints) 

// UploadedProducts is not included
const endpointsArr = [Calculator, Dashboard, Notifications, ProductStatistics, SendProductToSkudrop, UserManagement, BillingAddress, Profile];

export const TenantScenario = (initData) => {
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