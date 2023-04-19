import { setSession, postRequest, getRequest, consoleMessage, deleteRequest, timeStamp, setEndpointIterationDuration } from "../../functions.js";
import { randomString } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { sleep } from "k6";

const endpointName = 'UserManagement';

const userMembersAPIurl = '/api/tenants/users-memberes/';
const inviteUserAPIurl = '/api/users/invite/';
const userManipulatorAPIurl = '/api/tenants/users-manipulator/';

export function UserManagement(initData) {
    const startIterationTime = timeStamp();

    const session = setSession(initData.tenantUrl, initData.requestTimeout, initData.tenantToken);

    const randomEmail = `${randomString(10, '123456789asdfghjklmnbvcxzqwertyuiop')}@example.com`;

    const inviteUserRequestBody = {
        email: randomEmail
    };

    const inviteUserResp = postRequest(session, inviteUserAPIurl, null, endpointName, JSON.stringify(inviteUserRequestBody));

    sleep(1);

    const userMembersResp = getRequest(session, userMembersAPIurl, '?limit=1444', endpointName);

    sleep(1);

    if (userMembersResp && userMembersResp.json('results')) {
        const allInvitedUsers = userMembersResp.json('results');

        const invitedUser = allInvitedUsers.find(obj => {
            return obj.email === randomEmail;
        });

        if (invitedUser != undefined) {
            const deleteInvitedUserResp = deleteRequest(session, userManipulatorAPIurl, null, endpointName, JSON.stringify(inviteUserRequestBody));

            sleep(1);
        } else {
            consoleMessage("Can't find invited user", endpointName);
        };
    } else {
        consoleMessage("Can't parse users memberes list response", endpointName)
    };

    const endIterationTime = timeStamp();
    setEndpointIterationDuration(endIterationTime - startIterationTime, endpointName);
};