import { init } from "../init.js";
export { AdminTabs } from "../testCases/adminTab/adminTabs.js";
export { ReceiveIncomingCarton } from "../testCases/adminTab/receiveIncomingCarton.js";
export { OrdersToPrep } from "../testCases/adminTab/ordersToPrep.js";
export { Warehouse } from "../testCases/adminTab/warehouse.js";
export { ShipAddress } from "../testCases/adminTab/shipAddress.js";
export { UserCommunication } from "../testCases/adminTab/userCommunication.js";
export { AffiliateProgram } from "../testCases/adminTab/affiliateProgram.js";
export { UserRoles } from "../testCases/adminTab/userRoles.js";
export { ChargingRates } from "../testCases/adminTab/chargingRates.js";
export { SearchOrders } from "../testCases/adminTab/searchOrders.js";
export { ChangeStoredProduct } from "../testCases/adminTab/changeStoredProduct.js";
export { Statistics } from "../testCases/adminTab/statistics.js";
export { Dashboard } from "../testCases/tenantTab/dashboard.js";
export { Notifications } from "../testCases/tenantTab/notifications.js";
export { SendProductToSkudrop } from "../testCases/tenantTab/sendProductToSkudrop.js";
export { SendProductToAmazon } from "../testCases/tenantTab/sendProductToAmazon.js";
export { Calculator } from "../testCases/tenantTab/calculator.js";
export { Profile } from "../testCases/tenantTab/profile.js";
export { BillingAddress } from "../testCases/tenantTab/billingAddress.js";
export { UserManagement } from "../testCases/tenantTab/userManagement.js";
export { ProductStatistics } from "../testCases/tenantTab/productStatistics.js";
export { UploadedProducts } from "../testCases/tenantTab/uploadedProducts.js";
export { PortalTabs } from "../testCases/portalTab/portalTabs.js";
export { Container } from "../testCases/portalTab/container.js";
export { TaxRule } from "../testCases/portalTab/taxRule.js";
export { PortalSearch } from "../testCases/portalTab/portalSearch.js";


// Data for the test is configured here.
// It returns an object that can be retrieved from the props of all scenarios
export function setup() {
    return init();
}

// This config is used to debug or test one (several) endpoints at the same time
export const options = {
    insecureSkipTLSVerify: true,
    scenarios: {
        AdminTabs: {
            exec: 'AdminTabs',
            executor: 'shared-iterations',
            vus: 1,
            iterations: 1
        },
        // Max 1 active iteration recommended
        ReceiveIncomingCarton: {
            exec: 'ReceiveIncomingCarton',
            executor: 'shared-iterations',
            vus: 1,
            iterations: 1
        },
        OrdersToPrep: {
            exec: 'OrdersToPrep',
            executor: 'shared-iterations',
            vus: 1,
            iterations: 1
        },
        Warehouse: {
            exec: 'Warehouse',
            executor: 'shared-iterations',
            vus: 1,
            iterations: 1
        },
        // Max 5 active iterations recommended
        ShipAddress: {
            exec: 'ShipAddress',
            executor: 'shared-iterations',
            vus: 1,
            iterations: 1
        },
        UserCommunication: {
            exec: 'UserCommunication',
            executor: 'shared-iterations',
            vus: 1,
            iterations: 1
        },
        AffiliateProgram: {
            exec: 'AffiliateProgram',
            executor: 'shared-iterations',
            vus: 1,
            iterations: 1
        },
        UserRoles: {
            exec: 'UserRoles',
            executor: 'shared-iterations',
            vus: 1,
            iterations: 1
        },
        ChargingRates: {
            exec: 'ChargingRates',
            executor: 'shared-iterations',
            vus: 1,
            iterations: 1
        },
        Statistics: {
            exec: 'Statistics',
            executor: 'shared-iterations',
            vus: 1,
            iterations: 1
        },
        SearchOrders: {
            exec: 'SearchOrders',
            executor: 'shared-iterations',
            vus: 1,
            iterations: 1
        },
        ChangeStoredProduct: {
            exec: 'ChangeStoredProduct',
            executor: 'shared-iterations',
            vus: 1,
            iterations: 1
        },
        Dashboard: {
            exec: 'Dashboard',
            executor: 'shared-iterations',
            vus: 1,
            iterations: 1
        },
        Notifications: {
            exec: 'Notifications',
            executor: 'shared-iterations',
            vus: 1,
            iterations: 1
        },
        SendProductToSkudrop: {
            exec: 'SendProductToSkudrop',
            executor: 'shared-iterations',
            vus: 1,
            iterations: 1
        },
        SendProductToAmazon: {
            exec: 'SendProductToAmazon',
            executor: 'shared-iterations',
            vus: 1,
            iterations: 1
        },
        Calculator: {
            exec: 'Calculator',
            executor: 'shared-iterations',
            vus: 1,
            iterations: 1
        },
        Profile: {
            exec: 'Profile',
            executor: 'shared-iterations',
            vus: 1,
            iterations: 1
        },
        BillingAddress: {
            exec: 'BillingAddress',
            executor: 'shared-iterations',
            vus: 1,
            iterations: 1
        },
        UserManagement: {
            exec: 'UserManagement',
            executor: 'shared-iterations',
            vus: 1,
            iterations: 1
        },
        ProductStatistics: {
            exec: 'ProductStatistics',
            executor: 'shared-iterations',
            vus: 1,
            iterations: 1
        },
        UploadedProducts: {
            // Max 1 active iteration recommended
            exec: 'UploadedProducts',
            executor: 'shared-iterations',
            vus: 1,
            iterations: 1
        },
        PortalTabs: {
            exec: 'PortalTabs',
            executor: 'shared-iterations',
            vus: 1,
            iterations: 1
        },
        Container: {
            exec: 'Container',
            executor: 'shared-iterations',
            vus: 1,
            iterations: 1
        },
        TaxRule: {
            exec: 'TaxRule',
            executor: 'shared-iterations',
            vus: 1,
            iterations: 1
        },
        PortalSearch: {
            exec: 'PortalSearch',
            executor: 'shared-iterations',
            vus: 1,
            iterations: 1
        },
    },
};