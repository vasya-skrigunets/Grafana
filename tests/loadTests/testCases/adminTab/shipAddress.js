import { postRequest, deleteRequest, getRequest, setSession, randomInt, randomArrElement, consoleMessage, timeStamp, setEndpointIterationDuration, patchRequest } from "../../functions.js";
import { randomString } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { sleep } from "k6";

const endpointName = 'ShipAddress';

const mainShipAddressAPIurl = '/api/tenants/ship-from-address/';

export function ShipAddress(initData) {
    const startIterationTime = timeStamp();

    const session = setSession(initData.adminUrl, initData.requestTimeout, initData.adminToken);

    const getAddressesResp = getRequest(session, mainShipAddressAPIurl, null, endpointName);

    if (getAddressesResp && getAddressesResp.json('available_ids')) {
        const availableIds = getAddressesResp.json('available_ids');

        const randomAddress = `ADRS${randomString(4, 'asdfghjklmnbvcxzqwertyuiop')}${randomInt(1000, 9999)}`;
        const randomPostalCode = `${randomInt(10000, 99999)}`;
        const randAvailableAddressId = randomArrElement(availableIds);
        const city = "UndefinedCity";
        const state = "UndefinedRegion";

        const createAddressRequestBody = {
            address_line1: randomAddress,
            city: city,
            country_code: randAvailableAddressId.country_code,
            postal_code: randomPostalCode,
            state_or_province_code: state,
            marketplace_id: randAvailableAddressId.marketplace_id
        };

        const createAddressResp = postRequest(session, mainShipAddressAPIurl, null, endpointName, JSON.stringify(createAddressRequestBody));

        sleep(1);

        const changedRandomAddressLine1 = randomAddress + '_CHANGED';

        const changeAddressRequestBody = {
            address_line1: changedRandomAddressLine1,
            address_line2: null,
            city: city,
            state_or_province_code: state,
            postal_code: randomPostalCode
        };

        const changeAddressResp = patchRequest(session, mainShipAddressAPIurl, `${randAvailableAddressId.marketplace_id}/`, endpointName, JSON.stringify(changeAddressRequestBody));

        sleep(1);

        if (changeAddressResp && changeAddressResp.json('address_line1') == changedRandomAddressLine1) {
            const deleteAddressResp = deleteRequest(session, mainShipAddressAPIurl, `${randAvailableAddressId.marketplace_id}/`, endpointName);

            sleep(1);
        } else {
            consoleMessage("Error during changing address data, deleting address and interrupting iteration", endpointName);

            const deleteAddressResp = deleteRequest(session, mainShipAddressAPIurl, `${randAvailableAddressId.marketplace_id}/`, endpointName);

            sleep(1);
        };
    } else {
        consoleMessage("No addresses ID available, interrupting address creation and deletion", endpointName);
    };

    const endIterationTime = timeStamp();
    setEndpointIterationDuration(endIterationTime - startIterationTime, endpointName);
};