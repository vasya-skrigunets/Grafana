import { setSession, randomInt, patchRequest, decodeToken, getRequest, timeStamp, consoleMessage, setEndpointIterationDuration } from "../../functions.js";
import { randomString } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { sleep } from "k6";

const endpointName = 'Profile';

const mainUserAPIurl = '/api/users/';

export function Profile(initData) {
    const startIterationTime = timeStamp();

    const session = setSession(initData.tenantUrl, initData.requestTimeout, initData.tenantToken);

    const userID = decodeToken(initData.tenantToken);

    const randomFirstName = `FIRST${randomString(randomInt(5, 8), 'asdfghjklmnbvcxzqwertyuiop')}`;
    const randomLastName = `LAST${randomString(randomInt(5, 8), 'asdfghjklmnbvcxzqwertyuiop')}`;

    const setUserDataRequestBody = {
        email: initData.tenantEmail,
        first_name: randomFirstName,
        last_name: randomLastName
    };

    const setUserProfileResp = patchRequest(session, mainUserAPIurl, `${userID}/`, endpointName, JSON.stringify(setUserDataRequestBody));

    sleep(1);

    const getUserProfileResp = getRequest(session, mainUserAPIurl, `${userID}/`, endpointName);

    sleep(1);

    const endIterationTime = timeStamp();
    setEndpointIterationDuration(endIterationTime - startIterationTime, endpointName);
};