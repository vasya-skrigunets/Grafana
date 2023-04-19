import { postRequest, deleteRequest, getRequest, setSession, randomInt, randomArrElement, consoleMessage, timeStamp, setEndpointIterationDuration } from "../../functions.js";
import { randomString } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { sleep } from "k6";

const endpointName = "AffiliateProgram";

const mainAffiliateAPIurl = '/api/affiliate/';
const subscriptionPeriod = ['1', '2', '3', '4', '5', '6', '12'];
const feeDiscount = ['10', '20', '30', '40', '50'];

export function AffiliateProgram(initData) {
    const startIterationTime = timeStamp();
    const session = setSession(initData.adminUrl, initData.requestTimeout, initData.adminToken);

    const randomCode = `CODE${randomString(10, '123456789asdfghjklmnbvcxzqwertyuiop')}`;
    const email = `k6loadtest@email.com`;
    const randomRevenue = `0.0${randomInt(1, 6)}`;
    const randomSubscriptionPeriod = randomArrElement(subscriptionPeriod);
    const randomFeeDiscount = randomArrElement(feeDiscount);

    const createAffiliateRequestBody = {
        first_name: "Load",
        last_name: "Test",
        email: email,
        community_name: "SPLutsk-LoadTest",
        code: randomCode,
        revenue_per_cbm: randomRevenue,
        free_subscription_period: randomSubscriptionPeriod,
        prep_fee_discount: randomFeeDiscount,
        prep_fee_discount_period: randomSubscriptionPeriod
    };

    const createAffiliateResp = postRequest(session, mainAffiliateAPIurl, null, endpointName, JSON.stringify(createAffiliateRequestBody));

    sleep(1);

    const getAffiliatesResp = getRequest(session, mainAffiliateAPIurl, '?limit=1444', endpointName);

    sleep(1);

    if (getAffiliatesResp && getAffiliatesResp.body) {
        const allAffiliates = getAffiliatesResp.json('results');

        let createdAffiliate = {};

        for (let affiliate of allAffiliates) {
            affiliate.affiliate_programs.find(obj => {
                if (obj.code === randomCode) {
                    createdAffiliate = obj;
                }
            });
        };

        if (createdAffiliate && createdAffiliate.hasOwnProperty('id')) {
            const deleteAffiliateResp = deleteRequest(session, mainAffiliateAPIurl, `${createdAffiliate.id}/`, endpointName);

            sleep(1);
        } else {
            consoleMessage("Can't find created affiliate", endpointName);
        };
    } else {
        consoleMessage("Can't parse affiliates list response", endpointName);
    };

    const endIterationTime = timeStamp();
    setEndpointIterationDuration(endIterationTime - startIterationTime, endpointName);
};