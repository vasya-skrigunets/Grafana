import { getRequest, setSession, randomInt, consoleMessage, patchRequest, timeStamp, setEndpointIterationDuration } from "../../functions.js";
import { randomString } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { sleep } from "k6";

const endpointName = 'BillingAddress';

const mainBillingAddressAPIurl = '/api/tenants/tenants-billing-address/';

export function BillingAddress(initData) {
    const startIterationTime = timeStamp();

    const session = setSession(initData.tenantUrl, initData.requestTimeout, initData.tenantToken);

    const getBillingAddressResp = getRequest(session, mainBillingAddressAPIurl, null, endpointName);

    sleep(1);

    const userID = getBillingAddressResp.json('id');

    if (userID) {
        const randomLine = `LINE1 ${randomString(6, 'asdfghjklmnbvcxzqwertyuiop')}${randomInt(1000, 9999)}`;
        const randomPostalCode = `${randomInt(10000, 99999)}`;
        const randomPhone = `${randomInt(10000000000, 19999999999)}`;

        const setBillingAddressRequestBody = {
            billing_line1: randomLine,
            billing_postal_code: randomPostalCode,
            billing_city: "City",
            billing_state: "State",
            billing_country: "US",
            company_phone_number: randomPhone
        };

        const setBillingAddressResp = patchRequest(session, mainBillingAddressAPIurl, `${userID}/`, endpointName, JSON.stringify(setBillingAddressRequestBody));
        
        sleep(1);
    } else {
        consoleMessage("Fail to get billing address data", endpointName);
    };

    const endIterationTime = timeStamp();
    setEndpointIterationDuration(endIterationTime - startIterationTime, endpointName);
};