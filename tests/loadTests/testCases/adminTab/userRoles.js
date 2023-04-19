import { postRequest, patchRequest, setSession, getRequest, consoleMessage, timeStamp, setEndpointIterationDuration } from "../../functions.js";
import { randomString } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { sleep } from "k6";

const endpointName = 'UserRoles';

const createUserRoleAPIurl = '/api/users/invite/';
const changeUserRoleAPIurl = '/api/users/set-role/';

export function UserRoles(initData) {
    const startIterationTime = timeStamp();

    const session = setSession(initData.adminUrl, initData.requestTimeout, initData.adminToken);

    const randomEmail = `${randomString(10, '123456789asdfghjklmnbvcxzqwertyuiop')}@example.com`;

    const createUserRoleRequestBody = {
        role: "ADMINISTRATOR",
        email: randomEmail
    };

    const createUserRoleResp = postRequest(session, createUserRoleAPIurl, null, endpointName, JSON.stringify(createUserRoleRequestBody));

    sleep(1);

    const getUserRolesResp = getRequest(session, changeUserRoleAPIurl, '?limit=1444', endpointName);

    sleep(1);

    if (getUserRolesResp && getUserRolesResp.json('results')) {
        const allUserRoles = getUserRolesResp.json('results');
        const createdUserRole = allUserRoles.find(obj => {
            return obj.email === randomEmail;
        });

        if (createdUserRole != undefined) {
            const changeUserRoleBody = {
                role: "MANAGER",
            };

            const changeUserRoleResp = patchRequest(session, changeUserRoleAPIurl, `${createdUserRole.id}/`, endpointName, JSON.stringify(changeUserRoleBody));

            sleep(1);
        } else {
            consoleMessage("Can't find created user role, interrupting iteration", endpointName);
        };
    } else {
        consoleMessage("Can't parse user roles list response", endpointName);
    };

    const endIterationTime = timeStamp();
    setEndpointIterationDuration(endIterationTime - startIterationTime, endpointName);
};