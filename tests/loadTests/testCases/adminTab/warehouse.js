import { postRequest, deleteRequest, getRequest, setSession, randomInt, timeStamp, patchRequest, setEndpointIterationDuration, consoleMessage } from "../../functions.js";
import { randomString } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { sleep } from "k6";

const endpointName = 'Warehouse';

const createWarehouseAPIurl = '/api/tenants/new-warehouse/set-up/';
const warehousesListAPIurl = '/api/tenants/warehouses-list/';
const deleteWarehouseAPIurl = '/api/tenants/tenants-manipulator/';

export function Warehouse(initData) {
    const startIterationTime = timeStamp();

    const session = setSession(initData.adminUrl, initData.requestTimeout, initData.adminToken);

    const randomWarehouseId = `K6WRHS${randomString(10, 'asdfghjklmnbvcxzqwertyuiop1234567890')}`;
    const skudropUserName = randomWarehouseId.toLowerCase();
    const randomPostalCode = `${randomInt(10000, 99999)}`;
    const randomPhone = `${randomInt(10000000000, 19999999999)}`;
    const randomStorageCubicMeters = randomInt(1000, 5000);
    const randomAddress1 = `Address1 ${randomString(6, 'asdfghjklmnbvcxzqwertyuiop1234567890')}`;
    const randomAddress1CN = `${randomAddress1} CN`;
    const randomAddress2 = `Address2 ${randomString(6, 'asdfghjklmnbvcxzqwertyuiop1234567890')}`;
    const randomAddress2CN = `${randomAddress2} CN`;
    const randomCity = `City ${randomString(4, 'asdfghjklmnbvcxzqwertyuiop')}`;
    const randomCityCN = `${randomCity} CN`;
    const randomState = `State ${randomString(4, 'asdfghjklmnbvcxzqwertyuiop')}`;
    const randomStateCN = `${randomState} CN`;
    const randomContactName = `Person ${randomString(8, 'asdfghjklmnbvcxzqwertyuiop')}`;

    const createWarehouseRequestBody = {
        warehouse_custom_id: randomWarehouseId,
        slug: skudropUserName,
        address_line1: randomAddress1,
        address_line2: randomAddress2,
        cn_address_line1: randomAddress1CN,
        cn_address_line2: randomAddress2CN,
        city: randomCity,
        cn_city: randomCityCN,
        country_code: "US",
        cn_country_code: "US",
        state_or_province_code: randomState,
        cn_state_or_province_code: randomStateCN,
        postal_code: randomPostalCode,
        cn_postal_code: randomPostalCode,
        company_phone_number: randomPhone,
        contact_name: randomContactName,
        static_value_of_storage_cubic_meters: randomStorageCubicMeters,
    };

    const createWarehouseResp = postRequest(session, createWarehouseAPIurl, null, endpointName, JSON.stringify(createWarehouseRequestBody));

    sleep(1);

    const getWarehousesResp = getRequest(session, warehousesListAPIurl, '?limit=1444', endpointName);

    sleep(1);

    if (getWarehousesResp && getWarehousesResp.body && getWarehousesResp.json().hasOwnProperty('warehouses_list')) {
        const allWarehouses = getWarehousesResp.json('warehouses_list').results;

        // Searches for any created composition whose name matches the first 6 characters (these characters never change)
        const createdWarehouse = allWarehouses.find(obj => {
            return obj.slug.slice(0, 6) === skudropUserName.slice(0, 6);
        });

        if (createdWarehouse != undefined) {
                const deleteWarehouseResp = deleteRequest(session, deleteWarehouseAPIurl, `${createdWarehouse.id}/`, endpointName);

                sleep(1);
        } else {
            consoleMessage("There are no available created warehouses yet", endpointName);
        };
    } else {
        consoleMessage("Can't parse warehouse list response", endpointName);
    };

    const endIterationTime = timeStamp();
    setEndpointIterationDuration(endIterationTime - startIterationTime, endpointName);
};