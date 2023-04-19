import { getRequest, setSession, deleteRequest, randomArrElement, consoleMessage, timeStamp, setEndpointIterationDuration } from "../../functions.js";
import { sleep } from "k6";

const endpointName = 'Notifications';

const mainNotificationAPIurl = '/api/notifications/';

export function Notifications(initData) {
    const startIterationTime = timeStamp();

    const session = setSession(initData.tenantUrl, initData.requestTimeout, initData.tenantToken);

    const getNotificationsResp = getRequest(session, mainNotificationAPIurl, `?limit=1444`, endpointName);

    sleep(1);

    if (getNotificationsResp && getNotificationsResp.json('results')) {
        const receivedNotifications = getNotificationsResp.json('results');

        if (receivedNotifications != undefined && receivedNotifications.length) {
            const deleteNotificationsResp = deleteRequest(session, mainNotificationAPIurl, `${randomArrElement(receivedNotifications).id}/`, endpointName);

            sleep(1);
        } else {
            consoleMessage("Received response has no notifications", endpointName);
        };
    } else {
        consoleMessage("Can't parse notification list resp", endpointName);
    };

    const endIterationTime = timeStamp();
    setEndpointIterationDuration(endIterationTime - startIterationTime, endpointName);
};