import { consoleMessage, getRequest, postRequest, setEndpointIterationDuration, setSession, timeStamp } from "../../functions.js";
import { randomString } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { sleep } from "k6";

const endpointName = 'UserCommunication';

const communicationAPIurl = '/api/notifications/comunications/';
const tenantListAPIurl = '/api/notifications/tenant_list/';

export function UserCommunication(initData) {
    const startIterationTime = timeStamp();

    const session = setSession(initData.adminUrl, initData.requestTimeout, initData.adminToken);

    const getTenantListResp = getRequest(session, tenantListAPIurl, null, endpointName);

    if (getTenantListResp && getTenantListResp.body.length) {
        const tenant = getTenantListResp.json().find(obj => {
            return obj.email === initData.tenantEmail;
        });

        if (tenant != undefined) {
            const randomNotificationText = `NTF${randomString(15, '123456789asdfghjklmnbvcxzqwertyuiop ')}`;

            const createNotificationRequestBody = {
                send_notification: true,
                send_email: false,
                send_banner: false,
                notification_email_recipients: [
                    {
                        id: tenant.id,
                        email: tenant.email
                    }
                ],
                user_timezone: "Europe/Kiev",
                notification_text: randomNotificationText
            };

            const createNotificationResp = postRequest(session, communicationAPIurl, null, endpointName, JSON.stringify(createNotificationRequestBody));

            sleep(1);
        } else {
            consoleMessage("Can't find needed tenant", endpointName);
        };
    } else {
        consoleMessage("There are no available tenants to send notification", endpointName);
    };

    const endIterationTime = timeStamp();
    setEndpointIterationDuration(endIterationTime - startIterationTime, endpointName);
};