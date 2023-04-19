export { SendProductToAmazon } from "../smokeTest/tenantTab/sendProductToAmazon.js";
export { SendProductToSkudrop } from "../smokeTest/tenantTab/sendProductToSkudrop.js";
export { IncomingCartons } from "../smokeTest/adminTab/incomingCartons.js";
export { AddNewWarehouse } from "../fullTest/adminTab/addNewWarehouse.js";
export { CreateNotification } from "../fullTest/adminTab/createNotification.js";
export { CheckNotification } from "../fullTest/tenantTab/checkNotification.js";
export { Roles } from "../fullTest/adminTab/roles.js";
export { AddShipAddress } from "../fullTest/adminTab/addShipAddress.js";
export { AddProductsOrBrands } from "../smokeTest/tenantTab/addProductsOrBrands.js";
export { WarehouseDasboardTabs } from "../smokeTest/adminTab/warehouseDasboardTabs.js";
export { WarehouseDasboardTabs2 } from "../smokeTest/adminTab/warehouseDasboardTabs2.js";
export { ChangeUserData } from "../fullTest/tenantTab/changeUserData.js";
export { AffiliateProgram } from "../fullTest/adminTab/affiliateProgram.js";
export { ApplyAffiliate } from "../fullTest/tenantTab/applyAffiliate.js";
export { UpdateProductDimension } from "../fullTest/tenantTab/updateProductDimension.js";
export { ReceiveIncomingCarton } from "../fullTest/adminTab/receiveIncomingCarton.js";
export { CheckUpdatingProduct } from "../fullTest/tenantTab/checkUpdatingProduct.js";
export { LandingPageCalculator } from "../fullTest/tenantTab/landingPageCalculator.js";
export { PortalContainer } from "../fullTest/portalTab/portalContainer.js";
export { TaxRule } from "../fullTest/portalTab/taxRule.js";
export { ChargingRates } from "../fullTest/adminTab/chargingRates.js";
export { HelpSection } from "../fullTest/tenantTab/helpSection.js";
export { DeleteTenant } from "../fullTest/adminTab/deleteTenant.js";
export { SendProductToAmazon_AvailableCartons } from "../fullTest/tenantTab/sendProductToAmazon_AvailableCartons.js";
export { SendProductToAmazon_PortalContainer } from "../fullTest/tenantTab/sendProductToAmazon_PortalContainer.js";
export { SetAvailableProductCartons_CompleteOrder } from "../fullTest/adminTab/setAvailableProductCartons_CompleteOrder.js";
export { CheckAvailableProductCartons } from "../fullTest/tenantTab/checkAvailableProductCartons.js";

export const options = {
    insecureSkipTLSVerify: true,
    thresholds: {
        checks: [
            {
                threshold: 'rate>0.99',
                abortOnFail: true,
                delayAbortEval: '10s',
            },
        ],
    },
    scenarios: {
        SendProductToAmazon: {
            exec: 'SendProductToAmazon',
            executor: 'per-vu-iterations',
            startTime: '0s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
        SendProductToSkudrop: {
            exec: 'SendProductToSkudrop',
            executor: 'per-vu-iterations',
            startTime: '30s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
        IncomingCartons: {
            exec: 'IncomingCartons',
            executor: 'per-vu-iterations',
            startTime: '55s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
        AddNewWarehouse: {
            exec: 'AddNewWarehouse',
            executor: 'per-vu-iterations',
            startTime: '85s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
        CreateNotification: {
            exec: 'CreateNotification',
            executor: 'per-vu-iterations',
            startTime: '115s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
        CheckNotification: {
            exec: 'CheckNotification',
            executor: 'per-vu-iterations',
            startTime: '140s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
        SendProductToAmazon_PortalContainer: {
            exec: 'SendProductToAmazon_PortalContainer',
            executor: 'per-vu-iterations',
            startTime: '170s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
        SendProductToAmazon_AvailableCartons: {
            exec: 'SendProductToAmazon_AvailableCartons',
            executor: 'per-vu-iterations',
            startTime: '200s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
        Roles: {
            exec: 'Roles',
            executor: 'per-vu-iterations',
            startTime: '230s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
        AddShipAddress: {
            exec: 'AddShipAddress',
            executor: 'per-vu-iterations',
            startTime: '260s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
        AddProductsOrBrands: {
            exec: 'AddProductsOrBrands',
            executor: 'per-vu-iterations',
            startTime: '290s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
        WarehouseDasboardTabs: {
            exec: 'WarehouseDasboardTabs',
            executor: 'per-vu-iterations',
            startTime: '320s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
        WarehouseDasboardTabs2: {
            exec: 'WarehouseDasboardTabs2',
            executor: 'per-vu-iterations',
            startTime: '350s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
        UpdateProductDimension: {
            exec: 'UpdateProductDimension',
            executor: 'per-vu-iterations',
            startTime: '380s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
        AffiliateProgram: {
            exec: 'AffiliateProgram',
            executor: 'per-vu-iterations',
            startTime: '410s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
        ApplyAffiliate: {
            exec: 'ApplyAffiliate',
            executor: 'per-vu-iterations',
            startTime: '440s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
        LandingPageCalculator: {
            exec: 'LandingPageCalculator',
            executor: 'per-vu-iterations',
            startTime: '470s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
        ChargingRates: {
            exec: 'ChargingRates',
            executor: 'per-vu-iterations',
            startTime: '500s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
        HelpSection: {
            exec: 'HelpSection',
            executor: 'per-vu-iterations',
            startTime: '530s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
        ReceiveIncomingCarton: {
            exec: 'ReceiveIncomingCarton',
            executor: 'per-vu-iterations',
            startTime: '560s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
        CheckUpdatingProduct: {
            exec: 'CheckUpdatingProduct',
            executor: 'per-vu-iterations',
            startTime: '590s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
        SetAvailableProductCartons_CompleteOrder: {
            exec: 'SetAvailableProductCartons_CompleteOrder',
            executor: 'per-vu-iterations',
            startTime: '620s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
        CheckAvailableProductCartons: {
            exec: 'CheckAvailableProductCartons',
            executor: 'per-vu-iterations',
            startTime: '645s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
        PortalContainer: {
            exec: 'PortalContainer',
            executor: 'per-vu-iterations',
            startTime: '665s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
        TaxRule: {
            exec: 'TaxRule',
            executor: 'per-vu-iterations',
            startTime: '690s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
        ChangeUserData: {
            exec: 'ChangeUserData',
            executor: 'per-vu-iterations',
            startTime: '710s',
            maxDuration: '1m',
            gracefulStop: '1m',
            vus: 1,
        },
        // DeleteTenant: {
        //     exec: 'DeleteTenant',
        //     executor: 'per-vu-iterations',
        //     startTime: '740s',
        //     maxDuration: '1m',
        //     gracefulStop: '1m',
        //     vus: 1,
        // },
    },
};