import { getRequest, setSession, consoleMessage, randomArrElement, postRequest, randomInt, patchRequest, deleteRequest, timeStamp, setEndpointIterationDuration } from "../../functions.js";
import { randomString } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { sleep } from "k6";

const endpointName = 'Container';

const tenantTypeAPIurl = '/api/tenants/tenant-type/';
const createContainerAPIurl = '/api/ff/create_container/';
const changeContainerAPIurl = '/api/ff/update_container/';
const closeContainerAPIurl = '/api/ff/close_container/';
const deleteContainerAPIurl = '/api/ff/delete_container/';
const containersListAPIurl = '/api/ff/containers_list/';
const invoicesListAPIurl = '/api/ff/invoices_list/';

const preparedContainerSizes = ['20GP', '40GP', '40HQ', '45HQ'];
const preparedContainerTypes = ['REGULAR', 'CLXPLUS', 'CLXEXPRESS'];

export function Container(initData) {
    const startIterationTime = timeStamp();

    const session = setSession(initData.portalUrl, initData.requestTimeout, initData.portalToken);

    const getTenantTypeResp = getRequest(session, tenantTypeAPIurl, null, endpointName);

    sleep(1);

    const deleteContainer = (containerID) => {
        const deleteContainerResp = deleteRequest(session, deleteContainerAPIurl, `${containerID}/`, endpointName);

        sleep(1);
    };

    if (getTenantTypeResp && getTenantTypeResp.body) {
        const dateNow = new Date();
        let tmp = new Date();
        const newDate = new Date(tmp.setDate(tmp.getDate() + randomInt(14, 28)));

        const randomPOL = `POL ${randomString(10, '1234567890asdfghjklmnbvcxzqwertyuiop')}`;
        const randomPOD = `POD ${randomString(10, '1234567890asdfghjklmnbvcxzqwertyuiop')}`;
        const randomCarrier = `Carrier ${randomString(8, '1234567890asdfghjklmnbvcxzqwertyuiop')}`;
        const randomContainerNumber = `CN ${randomInt(10000000, 99999999)}`;
        const randomMawbNumber = `MN ${randomInt(100000, 999999)}`;
        const randomShipper = `Shipper ${randomString(8, 'asdfghjklmnbvcxzqwertyuiop')}`;
        const randomImporter = `Importer ${randomString(8, 'asdfghjklmnbvcxzqwertyuiop')}`;
        const randomConsignee = `Consignee ${randomString(8, 'asdfghjklmnbvcxzqwertyuiop')}`;
        const ETD = `${dateNow.toISOString().split('T')[0]}`;
        const ETA = `${newDate.toISOString().split('T')[0]}`;
        const randomContainerSize = randomArrElement(preparedContainerSizes);
        const randomContainerType = randomArrElement(preparedContainerTypes);
        const ownerID = getTenantTypeResp.json('id');
        const randomShipperAddress = `SA ${randomString(8, '1234567890asdfghjklmnbvcxzqwertyuiop')}`;
        const randomImporterAddress = `IA ${randomString(8, '1234567890asdfghjklmnbvcxzqwertyuiop')}`;
        const randomConsigneeAddress = `CA ${randomString(8, '1234567890asdfghjklmnbvcxzqwertyuiop')}`;

        const createContainerRequestBody = {
            port_of_loading: randomPOL,
            port_of_delivery: randomPOD,
            carrier: randomCarrier,
            container_number: randomContainerNumber,
            mawb_number: randomMawbNumber,
            shipper: randomShipper,
            importer: randomImporter,
            consignee: randomConsignee,
            estimated_time_of_departure: ETD,
            estimated_time_of_arrival: ETA,
            container_size: randomContainerSize,
            container_type: randomContainerType,
            owner: ownerID,
            shipper_address: randomShipperAddress,
            importer_address: randomImporterAddress,
            consignee_address: randomConsigneeAddress
        };

        const createContainerResp = postRequest(session, createContainerAPIurl, null, endpointName, JSON.stringify(createContainerRequestBody));

        sleep(1);

        const getContainersListResp = getRequest(session, containersListAPIurl, `${ownerID}/${randomContainerType}/?limit=1444`, endpointName);

        sleep(1);

        if (getContainersListResp && getContainersListResp.json('results')) {
            const allContainers = getContainersListResp.json('results');

            const createdContainer = allContainers.find(obj => {
                return obj.port_of_loading === randomPOL;
            });

            if (createdContainer != undefined) {
                const changedPOL = randomPOL + '_EDT';

                const changeContainerRequestBody = Object.assign(createContainerRequestBody, { port_of_loading: changedPOL });

                delete changeContainerRequestBody.container_size;
                delete changeContainerRequestBody.container_type;

                const changeCreatedContainer = patchRequest(session, changeContainerAPIurl, `${createdContainer.id}/`, endpointName, JSON.stringify(changeContainerRequestBody));

                sleep(1);

                if (changeCreatedContainer && changeCreatedContainer.json('port_of_loading') == changedPOL) {
                    const closeContainerRequestBody = {
                        is_closed: 'true'
                    };

                    const closeContainerResp = patchRequest(session, closeContainerAPIurl, `${createdContainer.id}/`, endpointName, JSON.stringify(closeContainerRequestBody));

                    sleep(1);

                    if (closeContainerResp && closeContainerResp.json('is_closed') == true) {
                        const getInvoicesListResp = getRequest(session, invoicesListAPIurl, `${ownerID}/${randomContainerType}/?limit=1444`, endpointName);

                        sleep(1);

                        const allInvoices = getInvoicesListResp.json('results');
                        
                        if (allInvoices != undefined) {
                            const wantedInvoice = allInvoices.find(obj => {
                                return obj.id === createdContainer.id;
                            });
                        } else {
                            consoleMessage("Can't parse invoices list, deleting container", endpointName);

                            deleteContainer(createdContainer.id);
                        };
                    } else {
                        consoleMessage("Container is not closed, deleting container", endpointName);

                        deleteContainer(createdContainer.id);
                    };
                } else {
                    consoleMessage("Error during changing container data, deleting container", endpointName);

                    deleteContainer(createdContainer.id);
                };
            } else {
                consoleMessage("Can't find created container from all containers list, deleting container using available data", endpointName);

                deleteContainer(createContainerResp.json('id'));
            };
        } else {
            consoleMessage("Can't parse getContainersListResp body, deleting container using available data", endpointName);

            deleteContainer(createContainerResp.json('id'));
        };
    } else {
        consoleMessage("Cant find user ID", endpointName);
    };

    const endIterationTime = timeStamp();
    setEndpointIterationDuration(endIterationTime - startIterationTime, endpointName);
};